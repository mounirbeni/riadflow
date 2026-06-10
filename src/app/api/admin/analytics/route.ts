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
      bookingsByRoomRaw,
      recentBookingsRaw,
      avgRatingAgg,
      avgStayAgg,
      avgValueAgg,
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
      prisma.booking.groupBy({
        by: ["roomId"],
        where: { bookingStatus: { not: BookingStatus.CANCELLED } },
        _count: { id: true },
      }),
      prisma.booking.findMany({
        where: {
          bookingStatus: { not: BookingStatus.CANCELLED },
          checkIn: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
        },
        include: {
          room: { select: { name: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { checkIn: "asc" },
        take: 5,
      }),
      prisma.review.aggregate({
        where: { isApproved: true },
        _avg: { rating: true },
      }),
      prisma.booking.aggregate({
        where: { bookingStatus: { not: BookingStatus.CANCELLED } },
        _avg: { totalNights: true },
      }),
      prisma.booking.aggregate({
        where: { bookingStatus: { not: BookingStatus.CANCELLED } },
        _avg: { totalAmount: true },
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

    // Map room IDs to names for pie chart
    const roomIds = bookingsByRoomRaw.map((b) => b.roomId);
    const rooms = await prisma.room.findMany({
      where: { id: { in: roomIds } },
      select: { id: true, name: true },
    });
    const roomNameMap = new Map(rooms.map((r) => [r.id, r.name]));
    const bookingsByRoom = bookingsByRoomRaw.map((b) => ({
      name: roomNameMap.get(b.roomId) || "Unknown",
      value: b._count.id,
    }));

    // Recent bookings
    const recentBookings = recentBookingsRaw.map((b) => ({
      guest: b.guestName || b.user?.name || "Guest",
      room: b.room?.name || "Unknown",
      checkIn: b.checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      nights: b.totalNights,
      amount: `€${Number(b.totalAmount).toFixed(0)}`,
      status: b.bookingStatus.toLowerCase(),
    }));

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
        bookingsByRoom,
        recentBookings,
        avgRating: avgRatingAgg._avg.rating ? Number(avgRatingAgg._avg.rating).toFixed(1) : "0.0",
        avgStayLength: avgStayAgg._avg.totalNights ? Number(avgStayAgg._avg.totalNights).toFixed(1) : "0.0",
        avgBookingValue: avgValueAgg._avg.totalAmount ? Number(avgValueAgg._avg.totalAmount).toFixed(0) : "0",
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
