import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          room: { select: { id: true, name: true, slug: true, pricePerNight: true } },
          messages: {
            include: { sender: { select: { id: true, name: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
          review: true,
          availability: true,
        },
      });

      if (!booking) {
        return NextResponse.json(
          { success: false, error: "Booking not found" },
          { status: 404 }
        );
      }

      const serialized = {
        ...booking,
        pricePerNight: Number(booking.pricePerNight),
        totalAmount: Number(booking.totalAmount),
        depositAmount: Number(booking.depositAmount),
      };

      return NextResponse.json({ success: true, data: serialized });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, name: true, slug: true } },
        messages: { select: { id: true }, where: { isRead: false, sender: { role: "GUEST" } } },
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
    console.error("Error fetching admin bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
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

    const { id, bookingStatus, paymentStatus } = await request.json();

    const updateData: any = {};
    if (bookingStatus) {
      updateData.bookingStatus = bookingStatus;
      if (bookingStatus === "COMPLETED") updateData.completedAt = new Date();
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === "PAID") {
        updateData.paymentVerifiedAt = new Date();
        updateData.paymentVerifiedBy = session.user.id;
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    const serializedBooking = {
      ...booking,
      pricePerNight: Number(booking.pricePerNight),
      totalAmount: Number(booking.totalAmount),
      depositAmount: Number(booking.depositAmount),
    };

    return NextResponse.json({ success: true, data: serializedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
