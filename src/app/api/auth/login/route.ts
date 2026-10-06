import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { apiError, checkOrigin, jsonBody } from "@/lib/http";
import { DomainError } from "@/lib/rules";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) }).safeParse(await jsonBody(request));
    if (!input.success) throw new DomainError("Masukkan email dan password yang valid.");
    const user = await db.user.findUnique({ where: { email: input.data.email.toLowerCase().trim() } });
    if (!user || !(await verifyPassword(input.data.password, user.passwordHash))) throw new DomainError("Email atau password tidak sesuai.", 401);
    await createSession(user.id);
    return NextResponse.json({ role: user.role });
  } catch (e) { return apiError(e); }
}
