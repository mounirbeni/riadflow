import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { paymentProofUrl, paymentMethod } = await request.json();

    const booking = await prisma.booking.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    await prisma.booking.update({
      where: { id },
      data: {
        paymentProof: paymentProofUrl,
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING_VERIFICATION,
        paymentProofUploadedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Payment proof uploaded" });
  } catch (error) {
    console.error("Payment proof error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload payment proof" },
      { status: 500 }
    );
  }
}
