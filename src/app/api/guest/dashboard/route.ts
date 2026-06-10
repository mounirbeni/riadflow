import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [totalBookings, upcomingBookings, totalSpent, unreadMessages] = await Promise.all([
      prisma.booking.count({ where: { userId: session.user.id } }),
      prisma.booking.count({
        where: {
          userId: session.user.id,
          checkIn: { gte: new Date() },
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
      }),
      prisma.booking.aggregate({
        where: {
          userId: session.user.id,
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
        _sum: { totalAmount: true },
      }),
      prisma.message.count({
        where: {
          sender: { role: "ADMIN" },
          isRead: false,
          booking: { userId: session.user.id },
        },
      }),
    ]);

    const recentBooking = await prisma.booking.findFirst({
      where: { userId: session.user.id },
      include: {
        room: { select: { name: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        upcomingBookings,
        totalSpent: totalSpent._sum.totalAmount || 0,
        unreadMessages,
        recentBooking,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
