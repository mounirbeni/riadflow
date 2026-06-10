"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  BedDouble,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Calendar,
  Star,
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalGuests: number;
  occupancyRate: number;
  pendingBookings: number;
  pendingPayments: number;
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyBookings: { month: string; bookings: number }[];
}

const COLORS = ["#D4684A", "#5C9440", "#D4A84A", "#7A6548", "#B8A080", "#9A8260"];

const pieData = [
  { name: "Sultan Suite", value: 3 },
  { name: "Kasbah Suite", value: 2 },
  { name: "Atlas Suite", value: 2 },
  { name: "Marrakech Room", value: 2 },
  { name: "Medina View", value: 2 },
  { name: "Garden Room", value: 2 },
];

const recentBookings = [
  { guest: "Sophie Laurent", room: "Kasbah Suite", checkIn: "Jun 8", nights: 7, amount: "€2,940", status: "confirmed" },
  { guest: "James Wilson", room: "Atlas Suite", checkIn: "Jun 10", nights: 6, amount: "€2,100", status: "confirmed" },
  { guest: "Emma Johnson", room: "Sultan Suite", checkIn: "Jun 18", nights: 7, amount: "€1,960", status: "confirmed" },
  { guest: "Hans Mueller", room: "Garden Room", checkIn: "Jun 22", nights: 5, amount: "€825", status: "confirmed" },
  { guest: "Priya Patel", room: "Sultan Suite", checkIn: "Jul 25", nights: 5, amount: "€1,400", status: "pending" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/admin/analytics");
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sand-500">Failed to load analytics</p>
      </div>
    );
  }

  const revenueChartData = data.monthlyRevenue.slice(-6).map((item) => ({
    month: item.month.slice(5),
    revenue: item.revenue,
  }));

  const bookingsChartData = data.monthlyBookings.slice(-6).map((item) => ({
    month: item.month.slice(5),
    bookings: item.bookings,
  }));

  const stats = [
    {
      label: "Total Revenue",
      value: `€${Number(data.totalRevenue).toLocaleString("en-EU", { maximumFractionDigits: 0 })}`,
      icon: CreditCard,
      color: "text-gold-500",
      bg: "bg-gold-50",
      trend: "+18%",
      trendUp: true,
      sub: "vs last quarter",
    },
    {
      label: "Total Bookings",
      value: data.totalBookings,
      icon: BedDouble,
      color: "text-terracotta-500",
      bg: "bg-terracotta-50",
      trend: "+12%",
      trendUp: true,
      sub: "vs last quarter",
    },
    {
      label: "Total Guests",
      value: data.totalGuests,
      icon: Users,
      color: "text-olive-500",
      bg: "bg-olive-50",
      trend: "+21%",
      trendUp: true,
      sub: "unique visitors",
    },
    {
      label: "Occupancy Rate",
      value: `${data.occupancyRate}%`,
      icon: TrendingUp,
      color: "text-sand-600",
      bg: "bg-sand-100",
      trend: "+5%",
      trendUp: true,
      sub: "this month",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sand-500 text-sm">
            Riad Al Baraka — overview as of {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="hidden md:flex items-center gap-2 text-sm text-terracotta-600 hover:text-terracotta-700 font-medium"
        >
          <Calendar className="h-4 w-4" />
          View All Bookings
        </Link>
      </div>

      {/* Alerts */}
      {(data.pendingBookings > 0 || data.pendingPayments > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.pendingBookings > 0 && (
            <Link href="/admin/bookings">
              <GlassCard className="p-4 bg-gold-50 border-gold-200 hover:bg-gold-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-gold-500" />
                  <div>
                    <p className="font-medium text-gold-700">
                      {data.pendingBookings} pending booking{data.pendingBookings > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-gold-500">Awaiting confirmation</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          )}
          {data.pendingPayments > 0 && (
            <Link href="/admin/payments">
              <GlassCard className="p-4 bg-terracotta-50 border-terracotta-200 hover:bg-terracotta-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-terracotta-500" />
                  <div>
                    <p className="font-medium text-terracotta-700">
                      {data.pendingPayments} payment{data.pendingPayments > 1 ? "s" : ""} to verify
                    </p>
                    <p className="text-sm text-terracotta-500">Awaiting verification</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <GlassCard className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trendUp
                    ? "bg-olive-50 text-olive-600"
                    : "bg-terracotta-50 text-terracotta-600"
                }`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-bold text-sand-900 mb-0.5">{stat.value}</p>
              <p className="text-sm font-medium text-sand-600">{stat.label}</p>
              <p className="text-xs text-sand-400 mt-1">{stat.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-lg font-semibold text-sand-900">Monthly Revenue</h3>
              <p className="text-sm text-sand-500">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-terracotta-50 text-terracotta-600 px-3 py-1.5 rounded-full font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              +18% vs prior period
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4684A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D4684A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9A8260" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: "#9A8260" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${v}`}
              />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E8DCC8", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`€${Number(v ?? 0).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D4684A"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ fill: "#D4684A", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Room Distribution Pie */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-heading text-lg font-semibold text-sand-900">Bookings by Room</h3>
            <p className="text-sm text-sand-500">All time distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E8DCC8", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [Number(v ?? 0), "Bookings"]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 11, color: "#7A6548" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Charts Row 2 + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Bar Chart */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-semibold text-sand-900">Monthly Bookings</h3>
            <p className="text-sm text-sand-500">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingsChartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9A8260" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9A8260" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E8DCC8", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [Number(v ?? 0), "Bookings"]}
              />
              <Bar dataKey="bookings" fill="#5C9440" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Recent Bookings Table */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading text-lg font-semibold text-sand-900">Recent Bookings</h3>
              <p className="text-sm text-sand-500">Upcoming confirmed stays</p>
            </div>
            <Link href="/admin/bookings" className="text-xs text-terracotta-500 hover:text-terracotta-600 font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-sand-50 transition-colors">
                <div className="h-9 w-9 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                  <span className="text-terracotta-600 font-semibold text-sm">{b.guest[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sand-900 text-sm truncate">{b.guest}</p>
                  <p className="text-xs text-sand-500">{b.room} · {b.nights} nights · Check-in {b.checkIn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sand-900 text-sm">{b.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.status === "confirmed"
                      ? "bg-olive-50 text-olive-600"
                      : "bg-gold-50 text-gold-600"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Star, label: "Avg. Rating", value: "4.9 / 5.0", color: "text-gold-500", bg: "bg-gold-50" },
          { icon: Users, label: "Returning Guests", value: "38%", color: "text-olive-500", bg: "bg-olive-50" },
          { icon: BedDouble, label: "Avg. Stay Length", value: "5.1 nights", color: "text-terracotta-500", bg: "bg-terracotta-50" },
          { icon: CreditCard, label: "Avg. Booking Value", value: "€1,240", color: "text-sand-600", bg: "bg-sand-100" },
        ].map((item) => (
          <GlassCard key={item.label} className="p-4 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div>
              <p className="font-bold text-sand-900">{item.value}</p>
              <p className="text-xs text-sand-500">{item.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
