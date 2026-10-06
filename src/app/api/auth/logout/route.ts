import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";
import { apiError, checkOrigin } from "@/lib/http";
export async function POST(request: Request) {
  try { checkOrigin(request); await deleteSession(); return NextResponse.json({ ok: true }); }
  catch (e) { return apiError(e); }
}
