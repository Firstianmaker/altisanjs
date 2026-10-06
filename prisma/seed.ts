import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { seedProducts } from "../src/lib/products";
import { hashPassword } from "../src/lib/password";
const db = new PrismaClient();
async function main() {
  for (const product of seedProducts) await db.product.upsert({ where: { id: product.id }, create: product, update: {} });
  const accounts = [
    { email: "buyer@ajs.demo", name: "Buyer Demo", role: "BUYER" as const, password: process.env.DEMO_BUYER_PASSWORD },
    { email: "admin@ajs.demo", name: "Admin AJS", role: "ADMIN" as const, password: process.env.DEMO_ADMIN_PASSWORD },
  ];
  for (const account of accounts) {
    if (!account.password || account.password.length < 12) throw new Error("Set both demo passwords in .env (minimum 12 characters).");
    const { password, ...data } = account;
    const passwordHash = await hashPassword(password);
    await db.user.upsert({ where: { email: account.email }, create: { ...data, passwordHash }, update: { passwordHash } });
  }
  console.log("Four products and demo accounts ready. Existing stock and orders preserved.");
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
