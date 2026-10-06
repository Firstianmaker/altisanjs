import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { updateStock } from "@/lib/orders";
import { apiError, checkOrigin, jsonBody } from "@/lib/http";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    checkOrigin(request);
    const user = await requireUser("ADMIN");
    return NextResponse.json(await updateStock(user.id, (await context.params).id, await jsonBody(request)));
  } catch (e) { return apiError(e); }
}
