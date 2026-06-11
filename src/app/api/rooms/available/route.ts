import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = parseInt(searchParams.get("guests") || "1");

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { success: false, error: "Check-out must be after check-in" },
        { status: 400 }
      );
    }

    // Find room IDs that have a blocked or booked date in the requested range
    const conflicting = await prisma.availability.findMany({
      where: {
        date: { gte: checkInDate, lt: checkOutDate },
        OR: [{ isBlocked: true }, { bookingId: { not: null } }],
      },
      select: { roomId: true },
    });

    const unavailableIds = [...new Set(conflicting.map((a) => a.roomId))];

    const rooms = await prisma.room.findMany({
      where: {
        isActive: true,
        capacity: { gte: guests },
        ...(unavailableIds.length > 0 && { id: { notIn: unavailableIds } }),
      },
      include: {
        reviews: { where: { isVisible: true }, select: { rating: true } },
      },
      orderBy: { sortOrder: "asc" },
    });

    const data = rooms.map((room) => ({
      ...room,
      pricePerNight: Number(room.pricePerNight),
      averageRating:
        room.reviews.length > 0
          ? room.reviews.reduce((s, r) => s + r.rating, 0) / room.reviews.length
          : null,
      reviewCount: room.reviews.length,
      reviews: undefined,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
