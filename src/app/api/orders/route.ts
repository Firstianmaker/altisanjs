import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { submitOrder } from "@/lib/orders";
import { apiError, checkOrigin, jsonBody } from "@/lib/http";
export async function GET() {
  try {
    const user = await requireUser("BUYER");
    return NextResponse.json(await db.order.findMany({ where: { buyerId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } }));
  } catch (e) { return apiError(e); }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const user = await requireUser("BUYER");
    return NextResponse.json(await submitOrder(user.id, await jsonBody(request)), { status: 201 });
  } catch (e) { return apiError(e); }
}
