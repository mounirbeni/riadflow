import { NextResponse } from "next/server";
import { runSeed } from "@/app/api/admin/seed/route";

export async function GET() {
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
