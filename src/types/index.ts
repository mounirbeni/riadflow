import { BookingStatus, PaymentStatus, Role } from "@prisma/client";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  totalSpent: number;
  unreadMessages: number;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  totalGuests: number;
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyBookings: { month: string; bookings: number }[];
}

export interface BookingWithDetails {
  id: string;
  bookingNumber: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  totalNights: number;
  pricePerNight: number;
  totalAmount: number;
  depositAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentProof?: string;
  room: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
  messages: {
    id: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
  review?: {
    id: string;
    rating: number;
    title: string | null;
    content: string;
  } | null;
}

export interface RoomWithReviews {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  pricePerNight: number;
  capacity: number;
  beds: string;
  bathrooms: number;
  size?: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
  featured: boolean;
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    content: string;
    createdAt: Date;
    user: {
      name: string | null;
      image: string | null;
    };
  }[];
}

export type UserRole = Role;
