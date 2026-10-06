import { z } from "zod";
export class DomainError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export const quantitySchema = z.number().int().positive().max(1_000_000);
export const requestSchema = z.object({
  submissionKey: z.string().uuid(),
  items: z.array(z.object({ productId: z.string().min(1).max(80), quantity: quantitySchema }).strict()).min(1).max(20),
}).strict().refine(data => new Set(data.items.map(i => i.productId)).size === data.items.length,
  { message: "Produk yang sama tidak boleh muncul dua kali." });
export const stockSchema = z.object({ stock: z.number().int().min(0).max(1_000_000), available: z.boolean().optional() }).strict();
export function checkStock(product: { name: string; available: boolean; stock: number; moq: number }, quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new DomainError("Quantity harus berupa KG bulat positif.");
  if (!product.available || product.stock === 0) throw new DomainError(`${product.name} sedang unavailable.`, 409);
  if (quantity < product.moq) throw new DomainError(`Minimum order ${product.name} adalah ${product.moq} KG.`);
  if (quantity > product.stock) throw new DomainError(`Stock ${product.name} tidak cukup. Tersedia ${product.stock} KG.`, 409);
}
