import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { checkStock, requestSchema, stockSchema } from "../src/lib/rules";
import { hashPassword, verifyPassword } from "../src/lib/password";
const product = { name: "Cakalang", available: true, stock: 850, moq: 100 };
test("300 KG Cakalang meets MOQ and stock", () => assert.doesNotThrow(() => checkStock(product, 300)));
test("reject zero, negative, fractional, below-MOQ and oversize quantities", () => {
  for (const q of [0, -100, 100.5, 99, 851, NaN, Infinity]) assert.throws(() => checkStock(product, q));
});
test("unavailable and exhausted products cannot be ordered", () => {
  assert.throws(() => checkStock({ ...product, available: false }, 100));
  assert.throws(() => checkStock({ ...product, stock: 0 }, 100));
});
test("request cannot inject a price or duplicate an item", () => {
  const item = { productId: "cakalang", quantity: 100 };
  assert.equal(requestSchema.safeParse({ submissionKey: randomUUID(), items: [{ ...item, unitPrice: 1 }] }).success, false);
  assert.equal(requestSchema.safeParse({ submissionKey: randomUUID(), items: [item, item] }).success, false);
  assert.equal(requestSchema.safeParse({ submissionKey: randomUUID(), items: [] }).success, false);
});
test("stock updates accept zero but not negative or fractional values", () => {
  assert.equal(stockSchema.safeParse({ stock: 0, available: false }).success, true);
  for (const stock of [-1, 0.5, 1000001]) assert.equal(stockSchema.safeParse({ stock, available: true }).success, false);
});
test("password hash is salted and verifies only the correct password", async () => {
  const hash = await hashPassword("BuyerDemo!2026");
  assert.notEqual(hash, await hashPassword("BuyerDemo!2026"));
  assert.equal(await verifyPassword("BuyerDemo!2026", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});
