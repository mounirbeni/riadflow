import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalRevenue,
      totalBookings,
      totalGuests,
      totalRooms,
      monthlyRevenue,
      monthlyBookings,
      pendingBookings,
      pendingPayments,
    ] = await Promise.all([
      prisma.booking.aggregate({
        where: { bookingStatus: { not: BookingStatus.CANCELLED } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.count(),
      prisma.user.count({ where: { role: "GUEST" } }),
      prisma.room.count(),
      prisma.booking.groupBy({
        by: ["checkIn"],
        where: {
          checkIn: { gte: startOfYear },
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.booking.groupBy({
        by: ["checkIn"],
        where: {
          checkIn: { gte: startOfYear },
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
        _count: { id: true },
      }),
      prisma.booking.count({ where: { bookingStatus: BookingStatus.PENDING } }),
      prisma.booking.count({
        where: { paymentStatus: "PENDING_VERIFICATION" },
      }),
    ]);

    // Calculate occupancy rate (simplified)
    const totalDays = 365;
    const bookedDays = await prisma.availability.count({
      where: { bookingId: { not: null } },
    });
    const occupancyRate = totalRooms > 0
      ? Math.min(100, Math.round((bookedDays / (totalRooms * totalDays)) * 100))
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue._sum.totalAmount) || 0,
        totalBookings,
        totalGuests,
        occupancyRate,
        pendingBookings,
        pendingPayments,
        monthlyRevenue: monthlyRevenue.map((m) => ({
          month: m.checkIn.toISOString().slice(0, 7),
          revenue: Number(m._sum.totalAmount) || 0,
        })),
        monthlyBookings: monthlyBookings.map((m) => ({
          month: m.checkIn.toISOString().slice(0, 7),
          bookings: m._count.id,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
