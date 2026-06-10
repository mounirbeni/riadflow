"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ChevronLeft, ChevronRight, BedDouble } from "lucide-react";

interface CalendarBooking {
  id: string;
  bookingNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  room: { name: string };
  bookingStatus: string;
}

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const monthName = currentDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const bookingsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().slice(0, 10);
    return bookings.filter((b) => {
      const checkIn = new Date(b.checkIn).toISOString().slice(0, 10);
      const checkOut = new Date(b.checkOut).toISOString().slice(0, 10);
      return dateStr >= checkIn && dateStr <= checkOut;
    });
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading calendar..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Calendar</h1>
          <p className="text-sand-500">Booking occupancy overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-sand-200 hover:bg-sand-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-sand-600" />
          </button>
          <span className="font-medium text-sand-900 min-w-[160px] text-center">{monthName}</span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-sand-200 hover:bg-sand-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-sand-600" />
          </button>
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-sand-500 py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNum = day + 1;
            const dayBookings = bookingsForDay(dayNum);
            const hasBooking = dayBookings.length > 0;
            const isToday =
              new Date().toDateString() === new Date(year, month, dayNum).toDateString();

            return (
              <div
                key={dayNum}
                className={`aspect-square p-2 rounded-xl border text-sm flex flex-col justify-between transition-colors ${
                  isToday
                    ? "border-terracotta-300 bg-terracotta-50"
                    : hasBooking
                    ? "border-olive-200 bg-olive-50"
                    : "border-sand-100 bg-white hover:bg-sand-50"
                }`}
              >
                <span className={`font-medium ${isToday ? "text-terracotta-600" : "text-sand-700"}`}>
                  {dayNum}
                </span>
                {hasBooking && (
                  <div className="flex flex-col gap-0.5">
                    {dayBookings.slice(0, 2).map((b) => (
                      <span
                        key={b.id}
                        className={`text-[10px] truncate px-1 py-0.5 rounded ${
                          b.bookingStatus === "CONFIRMED"
                            ? "bg-olive-100 text-olive-700"
                            : b.bookingStatus === "PENDING"
                            ? "bg-gold-100 text-gold-700"
                            : "bg-sand-100 text-sand-600"
                        }`}
                      >
                        {b.room.name}
                      </span>
                    ))}
                    {dayBookings.length > 2 && (
                      <span className="text-[10px] text-sand-500">+{dayBookings.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-olive-100 border border-olive-200" />
          <span className="text-sand-600">Has Bookings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-terracotta-50 border border-terracotta-300" />
          <span className="text-sand-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-white border border-sand-100" />
          <span className="text-sand-600">Available</span>
        </div>
      </div>
    </div>
  );
}
