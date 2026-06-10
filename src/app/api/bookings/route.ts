import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

function generateBookingNumber(): string {
  const prefix = "RF";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        room: { select: { id: true, name: true, slug: true, images: true } },
        messages: {
          where: { isRead: false },
          select: { id: true },
        },
        review: { select: { id: true, rating: true } },
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
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = body;

    if (!roomId || !checkIn || !checkOut || !guests || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room || !room.isActive) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    // Check availability
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid date range" },
        { status: 400 }
      );
    }

    // Check for existing bookings or blocked dates
    const dates: Date[] = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    const existing = await prisma.availability.findMany({
      where: {
        roomId,
        date: { in: dates },
        OR: [{ isBlocked: true }, { bookingId: { not: null } }],
      },
    });

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Room is not available for selected dates" },
        { status: 409 }
      );
    }

    const totalAmount = nights * Number(room.pricePerNight);
    const depositAmount = totalAmount * 0.3;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId: session.user.id,
        roomId,
        checkIn: start,
        checkOut: end,
        guests,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        totalNights: nights,
        pricePerNight: room.pricePerNight,
        totalAmount,
        depositAmount,
        bookingStatus: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
      },
      include: {
        room: { select: { id: true, name: true, slug: true, images: true } },
      },
    });

    // Create availability records
    await prisma.availability.createMany({
      data: dates.map((date) => ({
        roomId,
        date,
        bookingId: booking.id,
      })),
    });

    const serializedBooking = {
      ...booking,
      pricePerNight: Number(booking.pricePerNight),
      totalAmount: Number(booking.totalAmount),
      depositAmount: Number(booking.depositAmount),
    };

    return NextResponse.json({ success: true, data: serializedBooking });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
