import "dotenv/config";
import { before, beforeEach, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { seedProducts } from "../src/lib/products";
import { submitOrder, reviewOrder, updateStock, ownedOrder } from "../src/lib/orders";

const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith("_test")) throw new Error("Refusing to test against a non-test database.");
const client = new PrismaClient({ datasourceUrl: url });
const buyer = "test-buyer", otherBuyer = "test-other-buyer", admin = "test-admin";
const input = (quantity = 300, productId = "cakalang") => ({ submissionKey: randomUUID(), items: [{ productId, quantity }] });

before(async () => {
  for (const [id, role] of [[buyer, "BUYER"], [otherBuyer, "BUYER"], [admin, "ADMIN"]] as const) {
    await client.user.upsert({ where: { id }, create: { id, email: `${id}@ajs.test`, name: id, role, passwordHash: "integration-test-only" }, update: {} });
  }
});
beforeEach(async () => {
  await client.orderItem.deleteMany();
  await client.order.deleteMany();
  for (const product of seedProducts) await client.product.upsert({ where: { id: product.id }, create: product, update: product });
});
after(async () => { await client.$disconnect(); });
const stock = async (id = "cakalang") => (await client.product.findUniqueOrThrow({ where: { id } })).stock;

test("demo flow: submit 300 KG, no reservation, confirm reduces 850 to 550", async () => {
  const order = await submitOrder(buyer, input(), client);
  assert.equal(order.status, "Requested"); assert.equal(await stock(), 850);
  const result = await reviewOrder(admin, order.id, "Confirmed", client);
  assert.equal(result.status, "Confirmed"); assert.equal(await stock(), 550);
  assert.equal(result.items[0].unitPrice, 32000);
});
test("invalid quantities fail without creating an order", async () => {
  for (const q of [0, -1, 100.1, 99, 851]) await assert.rejects(submitOrder(buyer, input(q), client));
  assert.equal(await client.order.count(), 0);
});
test("submit rechecks stock and availability", async () => {
  await updateStock(admin, "cakalang", { stock: 200, available: true }, client);
  await assert.rejects(submitOrder(buyer, input(300), client), /Stock/);
  await client.product.update({ where: { id: "cakalang" }, data: { stock: 850, available: false } });
  await assert.rejects(submitOrder(buyer, input(100), client), /unavailable/);
});
test("confirmation rechecks changed stock and retains Requested on failure", async () => {
  const order = await submitOrder(buyer, input(), client);
  await updateStock(admin, "cakalang", { stock: 200, available: true }, client);
  await assert.rejects(reviewOrder(admin, order.id, "Confirmed", client), /Stock/);
  assert.equal((await client.order.findUniqueOrThrow({ where: { id: order.id } })).status, "Requested");
  assert.equal(await stock(), 200);
});
test("multiple items roll back together if a later product is unavailable", async () => {
  const order = await submitOrder(buyer, { submissionKey: randomUUID(), items: [{ productId: "cakalang", quantity: 300 }, { productId: "tuna-fillet", quantity: 50 }] }, client);
  await client.product.update({ where: { id: "tuna-fillet" }, data: { available: false } });
  await assert.rejects(reviewOrder(admin, order.id, "Confirmed", client));
  assert.equal(await stock(), 850); assert.equal(await stock("tuna-fillet"), 350);
  assert.equal((await client.order.findUniqueOrThrow({ where: { id: order.id } })).status, "Requested");
});
test("two competing confirmations cannot oversell", async () => {
  const first = await submitOrder(buyer, input(600), client);
  const second = await submitOrder(otherBuyer, input(600), client);
  const results = await Promise.allSettled([reviewOrder(admin, first.id, "Confirmed", client), reviewOrder(admin, second.id, "Confirmed", client)]);
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(await stock(), 250);
  assert.equal(await client.order.count({ where: { status: "Requested" } }), 1);
});
test("duplicate confirmations allocate stock only once", async () => {
  const order = await submitOrder(buyer, input(), client);
  const results = await Promise.allSettled([reviewOrder(admin, order.id, "Confirmed", client), reviewOrder(admin, order.id, "Confirmed", client)]);
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(await stock(), 550);
});
test("rejection preserves stock and cannot later be confirmed", async () => {
  const order = await submitOrder(buyer, input(), client);
  await reviewOrder(admin, order.id, "Rejected", client);
  assert.equal(await stock(), 850);
  await assert.rejects(reviewOrder(admin, order.id, "Confirmed", client));
});
test("exhausted stock automatically becomes unavailable", async () => {
  const order = await submitOrder(buyer, input(850), client);
  await reviewOrder(admin, order.id, "Confirmed", client);
  assert.equal((await client.product.findUniqueOrThrow({ where: { id: "cakalang" } })).available, false);
});
test("buyer cannot review orders, update stock, or read another buyer's request", async () => {
  const order = await submitOrder(buyer, input(), client);
  await assert.rejects(reviewOrder(buyer, order.id, "Confirmed", client), /admin/);
  await assert.rejects(updateStock(buyer, "cakalang", { stock: 500, available: true }, client), /admin/);
  await assert.rejects(ownedOrder(otherBuyer, order.id, client), /tidak ditemukan/);
  assert.equal((await ownedOrder(buyer, order.id, client)).id, order.id);
});
test("retried submission returns same order and preserves price snapshot", async () => {
  const request = input();
  const a = await submitOrder(buyer, request, client);
  await client.product.update({ where: { id: "cakalang" }, data: { price: 99999, name: "Updated name" } });
  const b = await submitOrder(buyer, request, client);
  assert.equal(a.id, b.id); assert.equal(await client.order.count(), 1);
  const saved = await ownedOrder(buyer, a.id, client);
  assert.equal(saved.items[0].unitPrice, 32000); assert.equal(saved.items[0].productName, "Cakalang");
});
test("submitted price manipulation is rejected", async () => {
  await assert.rejects(submitOrder(buyer, { submissionKey: randomUUID(), items: [{ productId: "cakalang", quantity: 300, unitPrice: 1 }] }, client));
  assert.equal(await client.order.count(), 0);
});


test("saving positive stock activates a product and zero deactivates it", async () => {
  await updateStock(admin, "cakalang", { stock: 0 }, client);
  assert.equal((await client.product.findUniqueOrThrow({ where: { id: "cakalang" } })).available, false);
  await updateStock(admin, "cakalang", { stock: 100, available: false }, client);
  assert.equal((await client.product.findUniqueOrThrow({ where: { id: "cakalang" } })).available, true);
  await updateStock(admin, "cakalang", { stock: 0, available: true }, client);
  assert.equal((await client.product.findUniqueOrThrow({ where: { id: "cakalang" } })).available, false);
});
