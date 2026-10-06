import { NextResponse } from "next/server";
import { DomainError } from "./rules";
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.APP_URL || request.url).origin;
  if (!origin || origin !== expected) throw new DomainError("Asal request tidak diizinkan.", 403);
}
export async function jsonBody(request: Request) {
  const text = await request.text();
  if (text.length > 20000) throw new DomainError("Request terlalu besar.", 413);
  try { return JSON.parse(text); } catch { throw new DomainError("Format request tidak valid."); }
}
export function apiError(error: unknown) {
  if (error instanceof DomainError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error(error);
  return NextResponse.json({ error: "Permintaan belum berhasil. Silakan coba lagi." }, { status: 500 });
}
