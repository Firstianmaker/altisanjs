import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { Role } from "@prisma/client";
import { db } from "./db";
import { DomainError } from "./rules";
export const SESSION_COOKIE = "ajs_session";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export async function currentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: digest(token) }, include: { user: true } });
  if (!session || session.expiresAt <= new Date()) return null;
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
}
export async function requireUser(role?: Role) {
  const user = await currentUser();
  if (!user) throw new DomainError("Silakan login terlebih dahulu.", 401);
  if (role && user.role !== role) throw new DomainError("Akses tidak diizinkan.", 403);
  return user;
}
export async function pageUser(role: Role) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== role) redirect(user.role === "ADMIN" ? "/admin" : "/buyer");
  return user;
}
export async function createSession(userId: string) {
  await deleteSession();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { tokenHash: digest(token), userId, expiresAt } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.APP_URL?.startsWith("https://") ?? false,
    path: "/", expires: expiresAt,
  });
}
export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: digest(token) } });
  jar.delete(SESSION_COOKIE);
}
