import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const messages = await prisma.message.findMany({
      include: {
        sender: { select: { id: true, name: true, role: true } },
        booking: { select: { id: true, bookingNumber: true, guestName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId, content } = await request.json();

    if (!bookingId || !content) {
      return NextResponse.json(
        { success: false, error: "Booking ID and content are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId: session.user.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        booking: { select: { id: true, bookingNumber: true } },
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 }
    );
  }
}
