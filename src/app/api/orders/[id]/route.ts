import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ownedOrder } from "@/lib/orders";
import { apiError } from "@/lib/http";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser("BUYER");
    return NextResponse.json(await ownedOrder(user.id, (await context.params).id));
  } catch (e) { return apiError(e); }
}
