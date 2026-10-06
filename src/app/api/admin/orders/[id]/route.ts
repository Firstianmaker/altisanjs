import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { reviewOrder } from "@/lib/orders";
import { apiError, checkOrigin, jsonBody } from "@/lib/http";
import { DomainError } from "@/lib/rules";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    checkOrigin(request);
    const user = await requireUser("ADMIN");
    const input = await jsonBody(request);
    if (!input || (input.status !== "Confirmed" && input.status !== "Rejected")) throw new DomainError("Status tidak valid.");
    return NextResponse.json(await reviewOrder(user.id, (await context.params).id, input.status));
  } catch (e) { return apiError(e); }
}
