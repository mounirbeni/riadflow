import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

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
    const { reason } = await request.json();

    const booking = await prisma.booking.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, error: "Booking already cancelled" },
        { status: 400 }
      );
    }

    await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: BookingStatus.CANCELLED,
        cancelReason: reason,
        cancelledAt: new Date(),
      },
    });

    // Free up availability
    await prisma.availability.deleteMany({
      where: { bookingId: id },
    });

    return NextResponse.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
