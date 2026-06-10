import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const capacity = searchParams.get("capacity");

    const where: any = { isActive: true };
    if (featured === "true") where.featured = true;
    if (capacity) where.capacity = { gte: parseInt(capacity) };

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        reviews: {
          where: { isVisible: true },
          select: { rating: true },
        },
      },
    });

    const roomsWithRating = rooms.map((room) => ({
      ...room,
      pricePerNight: Number(room.pricePerNight),
      averageRating:
        room.reviews.length > 0
          ? room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length
          : null,
      reviewCount: room.reviews.length,
    }));

    return NextResponse.json({ success: true, data: roomsWithRating });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
