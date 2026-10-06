import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "./db";
import { checkStock, DomainError, requestSchema, stockSchema } from "./rules";

async function atomic<T>(client: PrismaClient, work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await client.$transaction(work, { isolationLevel: "Serializable", timeout: 15000 }); }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        if (attempt < 2) continue;
        throw new DomainError("Stock sedang diperbarui. Silakan coba lagi.", 409);
      }
      throw error;
    }
  }
  throw new DomainError("Silakan coba lagi.", 409);
}

export async function submitOrder(buyerId: string, input: unknown, client = db) {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("Request tidak valid. Gunakan quantity KG bulat positif dan produk yang tidak berulang.");
  const { items, submissionKey } = parsed.data;
  const user = await client.user.findUnique({ where: { id: buyerId } });
  if (user?.role !== "BUYER") throw new DomainError("Hanya buyer yang dapat mengirim request.", 403);
  try {
    return await atomic(client, async tx => {
      const existing = await tx.order.findUnique({ where: { submissionKey } });
      if (existing) {
        if (existing.buyerId !== buyerId) throw new DomainError("Request tidak dapat diakses.", 403);
        return existing;
      }
      const products = await tx.product.findMany({ where: { id: { in: items.map(i => i.productId) } }, orderBy: { id: "asc" } });
      const orderItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new DomainError("Produk tidak ditemukan.", 404);
        checkStock(product, item.quantity);
        return { productId: product.id, productName: product.name, quantity: item.quantity, unitPrice: product.price };
      });
      return tx.order.create({ data: { buyerId, submissionKey, items: { create: orderItems } } });
    });
  } catch (error) {
    // A retried HTTP submission must return the original request, never create a duplicate.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await client.order.findUnique({ where: { submissionKey } });
      if (existing?.buyerId === buyerId) return existing;
    }
    throw error;
  }
}

export async function reviewOrder(adminId: string, orderId: string, decision: "Confirmed" | "Rejected", client = db) {
  const user = await client.user.findUnique({ where: { id: adminId } });
  if (user?.role !== "ADMIN") throw new DomainError("Akses admin diperlukan.", 403);
  return atomic(client, async tx => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: { orderBy: { productId: "asc" } } } });
    if (!order) throw new DomainError("Request tidak ditemukan.", 404);
    if (order.status !== "Requested") throw new DomainError("Request ini sudah ditinjau.", 409);
    const claimed = await tx.order.updateMany({ where: { id: orderId, status: "Requested" }, data: { status: decision, reviewedAt: new Date() } });
    if (claimed.count !== 1) throw new DomainError("Request ini sudah ditinjau.", 409);
    if (decision === "Confirmed") {
      for (const item of order.items) {
        const product = await tx.product.findUniqueOrThrow({ where: { id: item.productId } });
        checkStock(product, item.quantity);
        const changed = await tx.product.updateMany({
          where: { id: item.productId, available: true, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (changed.count !== 1) throw new DomainError(`Stock ${item.productName} berubah. Silakan tinjau ulang.`, 409);
        await tx.product.updateMany({ where: { id: item.productId, stock: 0 }, data: { available: false } });
      }
    }
    return tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
  });
}

export async function updateStock(adminId: string, productId: string, input: unknown, client = db) {
  const user = await client.user.findUnique({ where: { id: adminId } });
  if (user?.role !== "ADMIN") throw new DomainError("Akses admin diperlukan.", 403);
  const parsed = stockSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("Stock harus berupa KG bulat antara 0 dan 1.000.000.");
  return client.product.update({ where: { id: productId }, data: {
    stock: parsed.data.stock, available: parsed.data.stock > 0,
  } });
}

export async function ownedOrder(buyerId: string, id: string, client = db) {
  const order = await client.order.findFirst({ where: { id, buyerId }, include: { items: true } });
  if (!order) throw new DomainError("Request tidak ditemukan.", 404);
  return order;
}
