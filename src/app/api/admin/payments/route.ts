import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const serialized = bookings.map((b) => ({
      ...b,
      pricePerNight: Number(b.pricePerNight),
      totalAmount: Number(b.totalAmount),
      depositAmount: Number(b.depositAmount),
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, paymentStatus } = await request.json();

    const updateData: any = { paymentStatus };
    if (paymentStatus === "PAID") {
      updateData.paymentVerifiedAt = new Date();
      updateData.paymentVerifiedBy = session.user.id;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    const serialized = {
      ...booking,
      pricePerNight: Number(booking.pricePerNight),
      totalAmount: Number(booking.totalAmount),
      depositAmount: Number(booking.depositAmount),
    };

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
