import {
  PrismaClient,
  Role,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  ExperienceCategory,
  GalleryCategory,
} from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function d(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
}

function bookingNumber(n: number): string {
  return `RF-2024-${String(n).padStart(4, "0")}`;
}

async function main() {
  console.log("Seeding database...");

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@riadflow.com" },
    update: {},
    create: {
      email: "admin@riadflow.com",
      name: "Karim El Mansouri",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+212 524 123 456",
      country: "Morocco",
    },
  });

  const guestPassword = await bcrypt.hash("guest123", 12);

  const guests = await Promise.all([
    prisma.user.upsert({
      where: { email: "sophie.laurent@email.com" },
      update: {},
      create: {
        email: "sophie.laurent@email.com",
        name: "Sophie Laurent",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+33 6 12 34 56 78",
        country: "France",
      },
    }),
    prisma.user.upsert({
      where: { email: "james.wilson@email.com" },
      update: {},
      create: {
        email: "james.wilson@email.com",
        name: "James Wilson",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+44 7700 900123",
        country: "United Kingdom",
      },
    }),
    prisma.user.upsert({
      where: { email: "maria.garcia@email.com" },
      update: {},
      create: {
        email: "maria.garcia@email.com",
        name: "Maria Garcia",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+34 612 345 678",
        country: "Spain",
      },
    }),
    prisma.user.upsert({
      where: { email: "hans.mueller@email.com" },
      update: {},
      create: {
        email: "hans.mueller@email.com",
        name: "Hans Mueller",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+49 151 23456789",
        country: "Germany",
      },
    }),
    prisma.user.upsert({
      where: { email: "emma.johnson@email.com" },
      update: {},
      create: {
        email: "emma.johnson@email.com",
        name: "Emma Johnson",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+1 212 555 0192",
        country: "United States",
      },
    }),
    prisma.user.upsert({
      where: { email: "yuki.tanaka@email.com" },
      update: {},
      create: {
        email: "yuki.tanaka@email.com",
        name: "Yuki Tanaka",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+81 90 1234 5678",
        country: "Japan",
      },
    }),
    prisma.user.upsert({
      where: { email: "ale.ferrari@email.com" },
      update: {},
      create: {
        email: "ale.ferrari@email.com",
        name: "Alessandro Ferrari",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+39 347 123 4567",
        country: "Italy",
      },
    }),
    prisma.user.upsert({
      where: { email: "priya.patel@email.com" },
      update: {},
      create: {
        email: "priya.patel@email.com",
        name: "Priya Patel",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+44 7911 123456",
        country: "United Kingdom",
      },
    }),
    // legacy alias kept for backwards compat
    prisma.user.upsert({
      where: { email: "guest@example.com" },
      update: {},
      create: {
        email: "guest@example.com",
        name: "Sophie Laurent",
        password: guestPassword,
        role: Role.GUEST,
        phone: "+33 6 12 34 56 78",
        country: "France",
      },
    }),
  ]);
  console.log("Users created:", guests.length + 1);

  const [sophie, james, maria, hans, emma, yuki, ale, priya] = guests;

  // ── Rooms ──────────────────────────────────────────────────────────────────
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { slug: "sultan-suite" },
      update: {},
      create: {
        name: "Sultan Suite",
        slug: "sultan-suite",
        description:
          "Our most luxurious suite featuring a private rooftop terrace with panoramic views of the medina and Atlas Mountains. Hand-carved cedar ceilings, traditional zellige fountains, and a king-size four-poster bed draped in the finest Moroccan linens. The en-suite bathroom features a traditional tadelakt finish with a deep soaking tub and rainfall shower.",
        shortDesc: "Luxurious suite with private rooftop terrace and panoramic medina views",
        pricePerNight: 280,
        capacity: 2,
        beds: "1 King Bed",
        bathrooms: 1,
        size: 55,
        amenities: [
          "Air Conditioning",
          "Free WiFi",
          "Private Bathroom",
          "Rooftop Terrace",
          "Traditional Hammam",
          "Premium Toiletries",
          "Bathrobes & Slippers",
          "Safe",
          "Mini Bar",
        ],
        images: [
          "https://images.unsplash.com/photo-1528360983277?w=800&q=80",
          "https://images.unsplash.com/photo-1587974928442?w=800&q=80",
          "https://images.unsplash.com/photo-1565197722014?w=800&q=80",
        ],
        featured: true,
        sortOrder: 1,
      },
    }),
    prisma.room.upsert({
      where: { slug: "marrakech-room" },
      update: {},
      create: {
        name: "Marrakech Room",
        slug: "marrakech-room",
        description:
          "A charming room overlooking the central courtyard with its bubbling fountain and lush orange trees. Features hand-painted cedar doors, traditional Berber rugs, and a comfortable queen bed. The private bathroom includes tadelakt walls and traditional brass fixtures.",
        shortDesc: "Courtyard-facing room with traditional Moroccan decor",
        pricePerNight: 195,
        capacity: 2,
        beds: "1 Queen Bed",
        bathrooms: 1,
        size: 35,
        amenities: [
          "Air Conditioning",
          "Free WiFi",
          "Private Bathroom",
          "Courtyard Garden",
          "Moroccan Breakfast",
          "Hair Dryer",
          "Safe",
        ],
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        ],
        featured: true,
        sortOrder: 2,
      },
    }),
    prisma.room.upsert({
      where: { slug: "atlas-suite" },
      update: {},
      create: {
        name: "Atlas Suite",
        slug: "atlas-suite",
        description:
          "A spacious family suite with two king bedrooms, a shared living area with traditional Moroccan seating, and a private balcony. Perfect for families or groups of friends traveling together. Features stunning views of the Atlas Mountains from the rooftop access.",
        shortDesc: "Spacious family suite with two bedrooms and mountain views",
        pricePerNight: 350,
        capacity: 4,
        beds: "2 King Beds",
        bathrooms: 2,
        size: 75,
        amenities: [
          "Air Conditioning",
          "Free WiFi",
          "Private Bathroom",
          "Rooftop Terrace",
          "Room Service",
          "Flat Screen TV",
          "Premium Toiletries",
          "Bathrobes & Slippers",
          "Safe",
          "Mini Bar",
        ],
        images: [
          "https://images.unsplash.com/photo-1577898478989?w=800&q=80",
          "https://images.unsplash.com/photo-1528360983277?w=800&q=80",
        ],
        featured: true,
        sortOrder: 3,
      },
    }),
    prisma.room.upsert({
      where: { slug: "riad-garden-room" },
      update: {},
      create: {
        name: "Riad Garden Room",
        slug: "riad-garden-room",
        description:
          "A serene ground-floor room opening directly onto our lush garden courtyard. Wake up to the sound of birds and the scent of jasmine. Features a private patio area perfect for morning tea or evening relaxation.",
        shortDesc: "Ground-floor room with direct garden access",
        pricePerNight: 165,
        capacity: 2,
        beds: "1 Queen Bed",
        bathrooms: 1,
        size: 30,
        amenities: [
          "Air Conditioning",
          "Free WiFi",
          "Private Bathroom",
          "Courtyard Garden",
          "Moroccan Breakfast",
          "Hair Dryer",
        ],
        images: [
          "https://images.unsplash.com/photo-1587974928442?w=800&q=80",
        ],
        featured: false,
        sortOrder: 4,
      },
    }),
    prisma.room.upsert({
      where: { slug: "medina-view-room" },
      update: {},
      create: {
        name: "Medina View Room",
        slug: "medina-view-room",
        description:
          "Located on the upper floor with stunning views over the ancient medina rooftops. Watch the sunset paint the terracotta tiles in gold from your private window nook. Features traditional Moroccan decor with modern comforts.",
        shortDesc: "Upper floor room with medina rooftop views",
        pricePerNight: 210,
        capacity: 2,
        beds: "1 King Bed",
        bathrooms: 1,
        size: 32,
        amenities: [
          "Air Conditioning",
          "Free WiFi",
          "Private Bathroom",
          "Rooftop Terrace",
          "Moroccan Breakfast",
          "Safe",
          "Mini Bar",
        ],
        images: [
          "https://images.unsplash.com/photo-1565197722014?w=800&q=80",
        ],
        featured: false,
        sortOrder: 5,
      },
    }),
    prisma.room.upsert({
      where: { slug: "kasbah-suite" },
      update: {},
      create: {
        name: "Kasbah Suite",
        slug: "kasbah-suite",
        description:
          "Our most romantic suite featuring a private plunge pool on the terrace, perfect for cooling off after a day exploring the medina. Hand-stitched leather poufs, silk cushions, and antique brass lanterns create an atmosphere of pure Moroccan luxury.",
        shortDesc: "Romantic suite with private plunge pool",
        pricePerNight: 420,
        capacity: 2,
        beds: "1 King Bed",
        bathrooms: 1,
        size: 60,
        amenities: [
          "Air Conditioning",
          "Free WiFi",
          "Private Bathroom",
          "Rooftop Terrace",
          "Traditional Hammam",
          "Premium Toiletries",
          "Bathrobes & Slippers",
          "Safe",
          "Mini Bar",
          "Flat Screen TV",
        ],
        images: [
          "https://images.unsplash.com/photo-1528360983277?w=800&q=80",
          "https://images.unsplash.com/photo-1587974928442?w=800&q=80",
        ],
        featured: true,
        sortOrder: 6,
      },
    }),
  ]);
  const [sultanSuite, marrakechRoom, atlasSuite, gardenRoom, medinaView, kasbahSuite] = rooms;
  console.log("Rooms created:", rooms.length);

  // ── Experiences ────────────────────────────────────────────────────────────
  const experiences = await Promise.all([
    prisma.experience.upsert({
      where: { slug: "traditional-hammam" },
      update: {},
      create: {
        name: "Traditional Hammam",
        slug: "traditional-hammam",
        description:
          "Experience an authentic Moroccan hammam ritual in our traditional steam room. The treatment begins with black soap exfoliation, followed by ghassoul clay body mask, and finishes with a relaxing argan oil massage. Includes access to our relaxation lounge with mint tea.",
        shortDesc: "Authentic steam bath ritual with black soap, clay mask, and argan oil massage",
        price: 75,
        duration: "2 hours",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        category: ExperienceCategory.HAMMAM,
        sortOrder: 1,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "medina-walking-tour" },
      update: {},
      create: {
        name: "Medina Walking Tour",
        slug: "medina-walking-tour",
        description:
          "Discover the hidden secrets of Marrakech's ancient medina with our expert local guide. Visit historic sites, hidden souks, artisan workshops, and taste traditional street food. Learn about the rich history and culture of this UNESCO World Heritage site.",
        shortDesc: "Guided tour through ancient medina with local expert",
        price: 45,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
        category: ExperienceCategory.MEDINA_TOUR,
        sortOrder: 2,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "airport-transfer" },
      update: {},
      create: {
        name: "Airport Transfer",
        slug: "airport-transfer",
        description:
          "Private luxury transfer from Marrakech Menara Airport to the riad in a premium air-conditioned vehicle. Our driver will meet you at arrivals with a welcome sign and assist with luggage. Complimentary bottled water and WiFi included.",
        shortDesc: "Private premium transfer from Marrakech Airport",
        price: 35,
        duration: "30 min",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
        category: ExperienceCategory.AIRPORT_TRANSFER,
        sortOrder: 3,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "rooftop-dinner" },
      update: {},
      create: {
        name: "Rooftop Dinner",
        slug: "rooftop-dinner",
        description:
          "An unforgettable dining experience under the stars on our rooftop terrace. Enjoy a multi-course Moroccan feast prepared by our chef, featuring traditional tagines, couscous, and local specialties. Live traditional music and candlelit ambiance complete the magical evening.",
        shortDesc: "Multi-course Moroccan feast under the stars",
        price: 85,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        category: ExperienceCategory.DINNER,
        sortOrder: 4,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "atlas-mountains-excursion" },
      update: {},
      create: {
        name: "Atlas Mountains Excursion",
        slug: "atlas-mountains-excursion",
        description:
          "A full-day adventure to the stunning Atlas Mountains. Visit traditional Berber villages, hike through breathtaking valleys, and enjoy lunch at a local family's home. Includes transportation, guide, and meals.",
        shortDesc: "Full-day Berber village and mountain hiking adventure",
        price: 120,
        duration: "8 hours",
        image: "https://images.unsplash.com/photo-1542086260?w=800&q=80",
        category: ExperienceCategory.EXCURSION,
        sortOrder: 5,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "moroccan-cooking-class" },
      update: {},
      create: {
        name: "Moroccan Cooking Class",
        slug: "moroccan-cooking-class",
        description:
          "Learn the secrets of Moroccan cuisine from our master chef. Visit the local market to select fresh ingredients, then prepare traditional dishes like tagine, couscous, and pastilla. Enjoy the fruits of your labor for lunch with wine pairing.",
        shortDesc: "Market visit and hands-on cooking with master chef",
        price: 95,
        duration: "4 hours",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
        category: ExperienceCategory.COOKING_CLASS,
        sortOrder: 6,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "sunset-camel-ride" },
      update: {},
      create: {
        name: "Sunset Camel Ride",
        slug: "sunset-camel-ride",
        description:
          "Experience a magical sunset camel ride through the Palmeraie, Marrakech's ancient palm grove. Guided by a local Berber, ride through 150,000 palms as the sky turns crimson. Complimentary mint tea at a traditional Berber tent follows the ride.",
        shortDesc: "Guided sunset ride through the Marrakech Palmeraie",
        price: 55,
        duration: "1.5 hours",
        image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80",
        category: ExperienceCategory.EXCURSION,
        sortOrder: 7,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "private-spa-day" },
      update: {},
      create: {
        name: "Private Spa Day",
        slug: "private-spa-day",
        description:
          "A full day of pampering with our exclusive private spa package. Includes a traditional hammam session, argan oil body wrap, 90-minute deep tissue massage, and rejuvenating facial using organic Moroccan skincare. The day concludes with afternoon tea on the rooftop.",
        shortDesc: "Full-day hammam, massage, wrap and facial package",
        price: 195,
        duration: "6 hours",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        category: ExperienceCategory.HAMMAM,
        sortOrder: 8,
      },
    }),
  ]);
  console.log("Experiences created:", experiences.length);

  // ── Gallery ────────────────────────────────────────────────────────────────
  await prisma.galleryImage.deleteMany({});
  const galleryImages = await Promise.all([
    // ROOMS
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1528360983277?w=800&q=80", caption: "Sultan Suite – Main Bedroom", category: GalleryCategory.ROOMS, sortOrder: 1 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1565197722014?w=800&q=80", caption: "Atlas Suite – Living Area", category: GalleryCategory.ROOMS, sortOrder: 2 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", caption: "Marrakech Room – Bedroom", category: GalleryCategory.ROOMS, sortOrder: 3 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", caption: "Kasbah Suite – Terrace View", category: GalleryCategory.ROOMS, sortOrder: 4 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1577898478989?w=800&q=80", caption: "Riad Garden Room – Bathroom", category: GalleryCategory.ROOMS, sortOrder: 5 },
    }),
    // RIAD
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1587974928442?w=800&q=80", caption: "Central Courtyard Fountain", category: GalleryCategory.RIAD, sortOrder: 6 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1595351298020-038700609878?w=800&q=80", caption: "Rooftop Terrace at Sunset", category: GalleryCategory.RIAD, sortOrder: 7 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1548018560-c7196548c7ec?w=800&q=80", caption: "Garden Archways & Tilework", category: GalleryCategory.RIAD, sortOrder: 8 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80", caption: "Main Entrance Hall", category: GalleryCategory.RIAD, sortOrder: 9 },
    }),
    // FOOD
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", caption: "Rooftop Dinner Under the Stars", category: GalleryCategory.FOOD, sortOrder: 10 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1547592180?w=800&q=80", caption: "Traditional Moroccan Breakfast", category: GalleryCategory.FOOD, sortOrder: 11 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80", caption: "Lamb Tagine with Prunes", category: GalleryCategory.FOOD, sortOrder: 12 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&q=80", caption: "Mint Tea Ceremony", category: GalleryCategory.FOOD, sortOrder: 13 },
    }),
    // EXPERIENCES
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", caption: "Traditional Hammam", category: GalleryCategory.EXPERIENCES, sortOrder: 14 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80", caption: "Medina Souks Exploration", category: GalleryCategory.EXPERIENCES, sortOrder: 15 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80", caption: "Cooking Class with Chef Hassan", category: GalleryCategory.EXPERIENCES, sortOrder: 16 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80", caption: "Sunset Camel Ride – Palmeraie", category: GalleryCategory.EXPERIENCES, sortOrder: 17 },
    }),
    // DETAILS
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?w=800&q=80", caption: "Hand-Carved Cedar Ceiling Detail", category: GalleryCategory.DETAILS, sortOrder: 18 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1548018560-c7196548c7ec?w=800&q=80", caption: "Zellige Mosaic Tilework", category: GalleryCategory.DETAILS, sortOrder: 19 },
    }),
    prisma.galleryImage.create({
      data: { url: "https://images.unsplash.com/photo-1548514814-edca9d5fd82c?w=800&q=80", caption: "Handwoven Berber Textiles", category: GalleryCategory.DETAILS, sortOrder: 20 },
    }),
  ]);
  console.log("Gallery images created:", galleryImages.length);

  // ── Site Settings ──────────────────────────────────────────────────────────
  for (const [key, value] of [
    ["contact_phone", "+212 524 123 456"],
    ["contact_email", "hello@riadflow.com"],
    ["whatsapp_number", "+212524123456"],
    ["riad_name", "Riad Al Baraka"],
    ["riad_address", "12 Derb Lalla Aziza, Medina, Marrakech 40000, Morocco"],
    ["check_in_time", "15:00"],
    ["check_out_time", "11:00"],
    ["deposit_percentage", "30"],
  ] as [string, string][]) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // ── Demo Bookings, Messages, Reviews, Availability ─────────────────────────
  // Clean up existing demo data so we can re-seed idempotently
  await prisma.review.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.availability.deleteMany({});
  await prisma.booking.deleteMany({});

  type BookingSpec = {
    bookingNum: number;
    user: (typeof guests)[number];
    room: (typeof rooms)[number];
    checkIn: Date;
    checkOut: Date;
    nights: number;
    guests: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    specialRequests?: string;
    messages?: { fromAdmin: boolean; content: string }[];
    review?: { rating: number; title: string; content: string };
  };

  const specs: BookingSpec[] = [
    // ── Past completed bookings ────────────────────────────────────────────
    {
      bookingNum: 1,
      user: sophie,
      room: sultanSuite,
      checkIn: d(-90),
      checkOut: d(-83),
      nights: 7,
      guests: 2,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: "We would love rose petals on the bed for our anniversary. Champagne on arrival if possible.",
      messages: [
        { fromAdmin: false, content: "Bonjour! We are celebrating our 10th anniversary. Could you arrange something special for our arrival?" },
        { fromAdmin: true, content: "Bienvenue Sophie! Congratulations on your anniversary! We have arranged rose petals, a bottle of Moroccan rosé, and a special turndown service for your first evening. We look forward to welcoming you!" },
        { fromAdmin: false, content: "Merci beaucoup! That is absolutely wonderful. We cannot wait!" },
      ],
      review: { rating: 5, title: "The most magical anniversary trip", content: "Riad Al Baraka exceeded every expectation. The Sultan Suite was breathtaking — the rooftop terrace views at sunset were unforgettable. Karim and his team arranged rose petals and champagne for our anniversary arrival. The hammam experience was divine. Every morning we woke up to the smell of jasmine from the courtyard. We will absolutely return." },
    },
    {
      bookingNum: 2,
      user: james,
      room: kasbahSuite,
      checkIn: d(-75),
      checkOut: d(-70),
      nights: 5,
      guests: 2,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.PAYPAL,
      specialRequests: "Early check-in if possible. Flight arrives at 9am.",
      messages: [
        { fromAdmin: false, content: "Hello, is early check-in possible? Our flight arrives at 9am." },
        { fromAdmin: true, content: "Hello James! We can arrange early check-in from 12pm at no extra charge. We'll have the Kasbah Suite ready for you. Would you like us to arrange an airport transfer?" },
        { fromAdmin: false, content: "That would be brilliant, yes please for the transfer." },
        { fromAdmin: true, content: "Wonderful! I've arranged a private transfer. Your driver Ahmed will meet you at arrivals with a RiadFlow sign. Safe travels!" },
      ],
      review: { rating: 5, title: "Absolute luxury in the heart of the medina", content: "The Kasbah Suite is spectacular. The private plunge pool on the terrace was our favourite spot — we spent hours there with the rooftop views and cool water. The team arranged an airport transfer which was seamless. The rooftop dinner was a highlight of our entire Morocco trip. Highly recommend to anyone wanting authentic luxury." },
    },
    {
      bookingNum: 3,
      user: maria,
      room: atlasSuite,
      checkIn: d(-60),
      checkOut: d(-54),
      nights: 6,
      guests: 4,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: "We are a family with two children (ages 8 and 11). Do you have a children's menu for breakfast?",
      messages: [
        { fromAdmin: false, content: "Hola! We are travelling with our two children. Do you have any family-friendly activities?" },
        { fromAdmin: true, content: "¡Bienvenida Maria! We love having families at the riad. Our chef prepares a special children's breakfast. We also arrange family cooking classes and a kid-friendly medina tour. The Atlas Suite is perfect for your family!" },
        { fromAdmin: false, content: "Wonderful! Please book the cooking class for all four of us." },
      ],
      review: { rating: 5, title: "Perfect family escape — kids loved it!", content: "We came as a family of four and had the most amazing week. The Atlas Suite was huge and perfectly suited a family. Our kids absolutely fell in love with the cooking class — they still talk about making pastilla at home. Breakfast every morning was a feast. The staff were endlessly patient and kind with our children. This riad has a special soul." },
    },
    {
      bookingNum: 4,
      user: hans,
      room: medinaView,
      checkIn: d(-45),
      checkOut: d(-42),
      nights: 3,
      guests: 2,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.PAYPAL,
      messages: [
        { fromAdmin: false, content: "Guten Tag. We would like to book the Atlas Mountains excursion during our stay." },
        { fromAdmin: true, content: "Guten Tag Hans! Of course — the excursion departs at 8am and returns by 5pm. I'll confirm your booking for day 2 of your stay. Don't forget comfortable shoes!" },
      ],
      review: { rating: 4, title: "Wonderful medina experience", content: "A lovely stay in a beautiful room. The views over the medina from our window were exactly as described. The Atlas excursion was the highlight — our guide Omar was fantastic. Only small feedback: the street below can be noisy in the early morning. But the riad itself is an oasis of calm. Would return." },
    },
    {
      bookingNum: 5,
      user: emma,
      room: marrakechRoom,
      checkIn: d(-30),
      checkOut: d(-24),
      nights: 6,
      guests: 1,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: "Solo traveler. I'd love recommendations for safe solo female traveler activities.",
      messages: [
        { fromAdmin: false, content: "Hi! I'm traveling solo. Are there any group activities or tours I can join?" },
        { fromAdmin: true, content: "Welcome Emma! Solo travelers are very welcome here. We can connect you with small group medina tours, and our team is always available to advise on the best (and safest) areas to explore. We also have a lovely rooftop communal area where guests often meet and share tips." },
        { fromAdmin: false, content: "That's so reassuring, thank you!" },
        { fromAdmin: true, content: "Our pleasure! We've prepared a solo traveler guide in your room with our top recommendations. See you soon!" },
      ],
      review: { rating: 5, title: "Perfect solo trip — I felt completely safe and pampered", content: "As a solo female traveler I was a little nervous about Marrakech, but this riad made me feel completely at home from the moment I arrived. The team checked in on me daily and gave brilliant recommendations. The courtyard room was cozy and perfect for one. I did the medina tour, cooking class, and hammam — all arranged effortlessly. Already planning to return." },
    },
    {
      bookingNum: 6,
      user: yuki,
      room: gardenRoom,
      checkIn: d(-20),
      checkOut: d(-16),
      nights: 4,
      guests: 2,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.CASH_ON_ARRIVAL,
      messages: [
        { fromAdmin: false, content: "こんにちは。私たちは日本から来ます。英語対応は可能ですか？ (Hello, we are from Japan. Is English service available?)" },
        { fromAdmin: true, content: "こんにちは Yuki! Of course, we speak English and a little Japanese too! お越しをお待ちしております (We look forward to welcoming you)! Our team will make sure your stay is perfect." },
      ],
      review: { rating: 5, title: "忘れられない体験 (Unforgettable experience)", content: "Beautiful, authentic riad experience. The garden room was peaceful and the staff went out of their way to make us feel welcome, even learning a few Japanese phrases! The breakfast was exceptional — we loved the msemen and argan oil. The hammam was a truly unique cultural experience. We will definitely recommend to our friends and family." },
    },
    {
      bookingNum: 7,
      user: ale,
      room: sultanSuite,
      checkIn: d(-15),
      checkOut: d(-10),
      nights: 5,
      guests: 2,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      messages: [
        { fromAdmin: false, content: "Ciao! We are food lovers. Is it possible to have dinner at the riad every evening?" },
        { fromAdmin: true, content: "Ciao Alessandro! Assolutamente! Our chef would love to cook for you each evening. We can prepare a different traditional menu each night — tagine, bastilla, couscous, and more. Shall I arrange the rooftop dinner package for your entire stay?" },
        { fromAdmin: false, content: "Perfetto! Yes please, every evening on the rooftop sounds incredible." },
      ],
      review: { rating: 5, title: "Paradiso Marocchino — a culinary and sensory dream", content: "As Italians, we have high standards for food and hospitality — and Riad Al Baraka surpassed them completely. We had rooftop dinners every evening and each one was a masterpiece: the bastilla, the lamb tagine with preserved lemons, the harira soup at sunset. The Sultan Suite is exquisite. Every corner of this riad is a work of art. Torneremo presto!" },
    },
    {
      bookingNum: 8,
      user: priya,
      room: marrakechRoom,
      checkIn: d(-10),
      checkOut: d(-7),
      nights: 3,
      guests: 2,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.PAYPAL,
      review: { rating: 4, title: "Lovely riad, great location", content: "A really charming riad in a great medina location. The room was comfortable and beautifully decorated. Breakfast was delicious. The staff were very friendly and helpful. We would have liked the Wi-Fi to be a bit stronger in the room, but overall a wonderful stay. Would recommend and would return." },
    },

    // ── Current / active bookings ──────────────────────────────────────────
    {
      bookingNum: 9,
      user: sophie,
      room: kasbahSuite,
      checkIn: d(-2),
      checkOut: d(5),
      nights: 7,
      guests: 2,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: "Could you please prepare a late checkout at 2pm? Flying in the evening.",
      messages: [
        { fromAdmin: false, content: "Bonjour! Nous arrivons demain soir vers 20h. Est-ce que c'est possible de nous accueillir à cette heure?" },
        { fromAdmin: true, content: "Bonsoir Sophie! Absolument, nous serons là pour vous accueillir à 20h. Bon voyage!" },
      ],
    },
    {
      bookingNum: 10,
      user: james,
      room: atlasSuite,
      checkIn: d(0),
      checkOut: d(6),
      nights: 6,
      guests: 3,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.PAYPAL,
      messages: [
        { fromAdmin: false, content: "We're a group of three friends for a birthday trip. Can you arrange something special for the birthday boy?" },
        { fromAdmin: true, content: "How exciting! We'll arrange a birthday cake, decorations in the room, and a complimentary round of cocktails on the rooftop terrace. What is his name and the exact birthday date?" },
        { fromAdmin: false, content: "His name is Tom and his birthday is on June 13. You're amazing!" },
      ],
    },

    // ── Upcoming confirmed bookings ────────────────────────────────────────
    {
      bookingNum: 11,
      user: emma,
      room: sultanSuite,
      checkIn: d(8),
      checkOut: d(15),
      nights: 7,
      guests: 2,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: "Honeymoon trip! Any special touches would be amazing.",
      messages: [
        { fromAdmin: false, content: "We're coming for our honeymoon! Any special packages?" },
        { fromAdmin: true, content: "Mabrouk (Congratulations)! We have a special honeymoon package: rose petal turndown, bottle of Moroccan wine, couples hammam session, and a private rooftop dinner. Shall I add all of these to your reservation?" },
        { fromAdmin: false, content: "Yes please to everything! This is going to be perfect." },
      ],
    },
    {
      bookingNum: 12,
      user: hans,
      room: gardenRoom,
      checkIn: d(12),
      checkOut: d(17),
      nights: 5,
      guests: 2,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
    },
    {
      bookingNum: 13,
      user: ale,
      room: medinaView,
      checkIn: d(20),
      checkOut: d(25),
      nights: 5,
      guests: 2,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.PAYPAL,
      messages: [
        { fromAdmin: false, content: "Is it possible to arrange a private cooking class just for the two of us?" },
        { fromAdmin: true, content: "Assolutamente! We can arrange a private class with Chef Hassan on any morning during your stay. He will take you to the market first to choose ingredients. Which morning works best?" },
      ],
    },
    {
      bookingNum: 14,
      user: maria,
      room: kasbahSuite,
      checkIn: d(30),
      checkOut: d(37),
      nights: 7,
      guests: 2,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PENDING_VERIFICATION,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      specialRequests: "First time in Morocco! Any tips for first-timers?",
      messages: [
        { fromAdmin: false, content: "Hola! We have transferred the deposit. Can you confirm receipt?" },
        { fromAdmin: true, content: "Hola Maria! We have received your transfer and it is currently being verified — usually takes 1 business day. We will send you a confirmation email once approved. Muy emocionados por su visita!" },
      ],
    },

    // ── Pending booking (awaiting payment) ────────────────────────────────
    {
      bookingNum: 15,
      user: priya,
      room: sultanSuite,
      checkIn: d(45),
      checkOut: d(50),
      nights: 5,
      guests: 2,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      messages: [
        { fromAdmin: false, content: "Hi, I've just submitted my booking request. What are the payment options?" },
        { fromAdmin: true, content: "Hello Priya! Welcome to Riad Al Baraka. You can pay by bank transfer, PayPal, or cash on arrival. A 30% deposit is required to confirm. Please find our bank details in the booking confirmation email. We look forward to welcoming you!" },
      ],
    },
    {
      bookingNum: 16,
      user: yuki,
      room: marrakechRoom,
      checkIn: d(60),
      checkOut: d(65),
      nights: 5,
      guests: 2,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
    },

    // ── Cancelled booking ──────────────────────────────────────────────────
    {
      bookingNum: 17,
      user: james,
      room: medinaView,
      checkIn: d(-50),
      checkOut: d(-47),
      nights: 3,
      guests: 1,
      status: BookingStatus.CANCELLED,
      paymentStatus: PaymentStatus.REFUNDED,
      paymentMethod: PaymentMethod.PAYPAL,
      messages: [
        { fromAdmin: false, content: "Unfortunately I need to cancel my trip. There's been a family emergency." },
        { fromAdmin: true, content: "We are so sorry to hear that James. We hope everything is okay. Your booking has been cancelled and a full refund has been initiated. Please don't hesitate to rebook whenever you're ready — we'll reserve a special rate for you." },
      ],
    },
  ];

  let bookingCount = 0;
  let reviewCount = 0;
  let messageCount = 0;
  let availabilityCount = 0;

  for (const spec of specs) {
    const pricePerNight = Number(spec.room.pricePerNight);
    const totalAmount = pricePerNight * spec.nights;
    const depositAmount = totalAmount * 0.3;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: bookingNumber(spec.bookingNum),
        userId: spec.user.id,
        roomId: spec.room.id,
        checkIn: spec.checkIn,
        checkOut: spec.checkOut,
        guests: spec.guests,
        guestName: spec.user.name!,
        guestEmail: spec.user.email,
        guestPhone: spec.user.phone ?? "",
        specialRequests: spec.specialRequests,
        totalNights: spec.nights,
        pricePerNight,
        totalAmount,
        depositAmount,
        bookingStatus: spec.status,
        paymentStatus: spec.paymentStatus,
        paymentMethod: spec.paymentMethod,
        paymentVerifiedAt:
          spec.paymentStatus === PaymentStatus.PAID ? new Date(spec.checkIn.getTime() - 5 * 24 * 60 * 60 * 1000) : undefined,
        paymentVerifiedBy: spec.paymentStatus === PaymentStatus.PAID ? admin.id : undefined,
        completedAt: spec.status === BookingStatus.COMPLETED ? spec.checkOut : undefined,
        cancelledAt: spec.status === BookingStatus.CANCELLED ? new Date() : undefined,
        cancelReason: spec.status === BookingStatus.CANCELLED ? "Guest family emergency — full refund issued." : undefined,
        createdAt: new Date(spec.checkIn.getTime() - 21 * 24 * 60 * 60 * 1000),
      },
    });
    bookingCount++;

    // Availability blocks for confirmed/completed bookings
    if (spec.status !== BookingStatus.CANCELLED && spec.status !== BookingStatus.PENDING) {
      const datesCursor = new Date(spec.checkIn);
      while (datesCursor < spec.checkOut) {
        await prisma.availability.upsert({
          where: { roomId_date: { roomId: spec.room.id, date: new Date(datesCursor) } },
          update: { isBlocked: true, bookingId: booking.id },
          create: { roomId: spec.room.id, date: new Date(datesCursor), isBlocked: true, bookingId: booking.id },
        });
        datesCursor.setDate(datesCursor.getDate() + 1);
        availabilityCount++;
      }
    }

    // Messages
    if (spec.messages) {
      for (const msg of spec.messages) {
        await prisma.message.create({
          data: {
            bookingId: booking.id,
            senderId: msg.fromAdmin ? admin.id : spec.user.id,
            content: msg.content,
            isRead: true,
          },
        });
        messageCount++;
      }
    }

    // Reviews (only for COMPLETED bookings)
    if (spec.review && spec.status === BookingStatus.COMPLETED) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          roomId: spec.room.id,
          userId: spec.user.id,
          rating: spec.review.rating,
          title: spec.review.title,
          content: spec.review.content,
          isApproved: true,
          isVisible: true,
          createdAt: new Date(spec.checkOut.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      });
      reviewCount++;
    }
  }

  console.log(`Bookings created: ${bookingCount}`);
  console.log(`Availability records: ${availabilityCount}`);
  console.log(`Messages created: ${messageCount}`);
  console.log(`Reviews created: ${reviewCount}`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
