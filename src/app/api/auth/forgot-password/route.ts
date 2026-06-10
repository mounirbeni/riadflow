import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }
    // Placeholder - in production, generate token and send email
    return NextResponse.json({ success: true, message: "Reset link sent" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send reset link" },
      { status: 500 }
    );
  }
}
