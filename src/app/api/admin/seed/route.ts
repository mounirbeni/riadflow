import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Role,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  ExperienceCategory,
  GalleryCategory,
} from "@prisma/client";
import bcrypt from "bcryptjs";

function d(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
}

function bn(n: number): string {
  return `RF-2024-${String(n).padStart(4, "0")}`;
}

export async function runSeed() {
  try {
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@riadflow.com" },
      update: {},
      create: { email: "admin@riadflow.com", name: "Karim El Mansouri", password: adminPassword, role: Role.ADMIN, phone: "+212 524 123 456", country: "Morocco" },
    });

    const gp = await bcrypt.hash("guest123", 12);
    const guests = await Promise.all([
      prisma.user.upsert({ where: { email: "sophie.laurent@email.com" }, update: {}, create: { email: "sophie.laurent@email.com", name: "Sophie Laurent", password: gp, role: Role.GUEST, phone: "+33 6 12 34 56 78", country: "France" } }),
      prisma.user.upsert({ where: { email: "james.wilson@email.com" }, update: {}, create: { email: "james.wilson@email.com", name: "James Wilson", password: gp, role: Role.GUEST, phone: "+44 7700 900123", country: "United Kingdom" } }),
      prisma.user.upsert({ where: { email: "maria.garcia@email.com" }, update: {}, create: { email: "maria.garcia@email.com", name: "Maria Garcia", password: gp, role: Role.GUEST, phone: "+34 612 345 678", country: "Spain" } }),
      prisma.user.upsert({ where: { email: "hans.mueller@email.com" }, update: {}, create: { email: "hans.mueller@email.com", name: "Hans Mueller", password: gp, role: Role.GUEST, phone: "+49 151 23456789", country: "Germany" } }),
      prisma.user.upsert({ where: { email: "emma.johnson@email.com" }, update: {}, create: { email: "emma.johnson@email.com", name: "Emma Johnson", password: gp, role: Role.GUEST, phone: "+1 212 555 0192", country: "United States" } }),
      prisma.user.upsert({ where: { email: "yuki.tanaka@email.com" }, update: {}, create: { email: "yuki.tanaka@email.com", name: "Yuki Tanaka", password: gp, role: Role.GUEST, phone: "+81 90 1234 5678", country: "Japan" } }),
      prisma.user.upsert({ where: { email: "ale.ferrari@email.com" }, update: {}, create: { email: "ale.ferrari@email.com", name: "Alessandro Ferrari", password: gp, role: Role.GUEST, phone: "+39 347 123 4567", country: "Italy" } }),
      prisma.user.upsert({ where: { email: "priya.patel@email.com" }, update: {}, create: { email: "priya.patel@email.com", name: "Priya Patel", password: gp, role: Role.GUEST, phone: "+44 7911 123456", country: "United Kingdom" } }),
    ]);
    const [sophie, james, maria, hans, emma, yuki, ale, priya] = guests;

    const rooms = await Promise.all([
      prisma.room.upsert({ where: { slug: "sultan-suite" }, update: {}, create: { name: "Sultan Suite", slug: "sultan-suite", description: "Our most luxurious suite featuring a private rooftop terrace with panoramic views of the medina and Atlas Mountains. Hand-carved cedar ceilings, traditional zellige fountains, and a king-size four-poster bed draped in the finest Moroccan linens.", shortDesc: "Luxurious suite with private rooftop terrace and panoramic medina views", pricePerNight: 280, capacity: 2, beds: "1 King Bed", bathrooms: 1, size: 55, amenities: ["Air Conditioning", "Free WiFi", "Private Bathroom", "Rooftop Terrace", "Traditional Hammam", "Premium Toiletries", "Bathrobes & Slippers", "Safe", "Mini Bar"], images: ["https://images.unsplash.com/photo-1528360983277?w=800&q=80", "https://images.unsplash.com/photo-1587974928442?w=800&q=80", "https://images.unsplash.com/photo-1565197722014?w=800&q=80"], featured: true, sortOrder: 1 } }),
      prisma.room.upsert({ where: { slug: "marrakech-room" }, update: {}, create: { name: "Marrakech Room", slug: "marrakech-room", description: "A charming room overlooking the central courtyard with its bubbling fountain and lush orange trees. Features hand-painted cedar doors, traditional Berber rugs, and a comfortable queen bed.", shortDesc: "Courtyard-facing room with traditional Moroccan decor", pricePerNight: 195, capacity: 2, beds: "1 Queen Bed", bathrooms: 1, size: 35, amenities: ["Air Conditioning", "Free WiFi", "Private Bathroom", "Courtyard Garden", "Moroccan Breakfast", "Hair Dryer", "Safe"], images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"], featured: true, sortOrder: 2 } }),
      prisma.room.upsert({ where: { slug: "atlas-suite" }, update: {}, create: { name: "Atlas Suite", slug: "atlas-suite", description: "A spacious family suite with two king bedrooms, a shared living area with traditional Moroccan seating, and a private balcony. Perfect for families or groups of friends traveling together.", shortDesc: "Spacious family suite with two bedrooms and mountain views", pricePerNight: 350, capacity: 4, beds: "2 King Beds", bathrooms: 2, size: 75, amenities: ["Air Conditioning", "Free WiFi", "Private Bathroom", "Rooftop Terrace", "Room Service", "Flat Screen TV", "Premium Toiletries", "Bathrobes & Slippers", "Safe", "Mini Bar"], images: ["https://images.unsplash.com/photo-1577898478989?w=800&q=80", "https://images.unsplash.com/photo-1528360983277?w=800&q=80"], featured: true, sortOrder: 3 } }),
      prisma.room.upsert({ where: { slug: "riad-garden-room" }, update: {}, create: { name: "Riad Garden Room", slug: "riad-garden-room", description: "A serene ground-floor room opening directly onto our lush garden courtyard. Wake up to the sound of birds and the scent of jasmine. Features a private patio area perfect for morning tea.", shortDesc: "Ground-floor room with direct garden access", pricePerNight: 165, capacity: 2, beds: "1 Queen Bed", bathrooms: 1, size: 30, amenities: ["Air Conditioning", "Free WiFi", "Private Bathroom", "Courtyard Garden", "Moroccan Breakfast", "Hair Dryer"], images: ["https://images.unsplash.com/photo-1587974928442?w=800&q=80"], featured: false, sortOrder: 4 } }),
      prisma.room.upsert({ where: { slug: "medina-view-room" }, update: {}, create: { name: "Medina View Room", slug: "medina-view-room", description: "Located on the upper floor with stunning views over the ancient medina rooftops. Watch the sunset paint the terracotta tiles in gold from your private window nook.", shortDesc: "Upper floor room with medina rooftop views", pricePerNight: 210, capacity: 2, beds: "1 King Bed", bathrooms: 1, size: 32, amenities: ["Air Conditioning", "Free WiFi", "Private Bathroom", "Rooftop Terrace", "Moroccan Breakfast", "Safe", "Mini Bar"], images: ["https://images.unsplash.com/photo-1565197722014?w=800&q=80"], featured: false, sortOrder: 5 } }),
      prisma.room.upsert({ where: { slug: "kasbah-suite" }, update: {}, create: { name: "Kasbah Suite", slug: "kasbah-suite", description: "Our most romantic suite featuring a private plunge pool on the terrace. Hand-stitched leather poufs, silk cushions, and antique brass lanterns create an atmosphere of pure Moroccan luxury.", shortDesc: "Romantic suite with private plunge pool", pricePerNight: 420, capacity: 2, beds: "1 King Bed", bathrooms: 1, size: 60, amenities: ["Air Conditioning", "Free WiFi", "Private Bathroom", "Rooftop Terrace", "Traditional Hammam", "Premium Toiletries", "Bathrobes & Slippers", "Safe", "Mini Bar", "Flat Screen TV"], images: ["https://images.unsplash.com/photo-1528360983277?w=800&q=80", "https://images.unsplash.com/photo-1587974928442?w=800&q=80"], featured: true, sortOrder: 6 } }),
    ]);
    const [sultanSuite, marrakechRoom, atlasSuite, gardenRoom, medinaView, kasbahSuite] = rooms;

    await Promise.all([
      prisma.experience.upsert({ where: { slug: "traditional-hammam" }, update: {}, create: { name: "Traditional Hammam", slug: "traditional-hammam", description: "Experience an authentic Moroccan hammam ritual in our traditional steam room. Black soap exfoliation, ghassoul clay mask, and argan oil massage.", shortDesc: "Authentic steam bath ritual with black soap, clay mask, and argan oil massage", price: 75, duration: "2 hours", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", category: ExperienceCategory.HAMMAM, sortOrder: 1 } }),
      prisma.experience.upsert({ where: { slug: "medina-walking-tour" }, update: {}, create: { name: "Medina Walking Tour", slug: "medina-walking-tour", description: "Discover the hidden secrets of Marrakech's ancient medina with our expert local guide. Visit historic sites, hidden souks, and artisan workshops.", shortDesc: "Guided tour through ancient medina with local expert", price: 45, duration: "3 hours", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80", category: ExperienceCategory.MEDINA_TOUR, sortOrder: 2 } }),
      prisma.experience.upsert({ where: { slug: "airport-transfer" }, update: {}, create: { name: "Airport Transfer", slug: "airport-transfer", description: "Private luxury transfer from Marrakech Menara Airport in a premium air-conditioned vehicle. Driver meets you at arrivals with a welcome sign.", shortDesc: "Private premium transfer from Marrakech Airport", price: 35, duration: "30 min", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80", category: ExperienceCategory.AIRPORT_TRANSFER, sortOrder: 3 } }),
      prisma.experience.upsert({ where: { slug: "rooftop-dinner" }, update: {}, create: { name: "Rooftop Dinner", slug: "rooftop-dinner", description: "An unforgettable dining experience under the stars on our rooftop terrace. Multi-course Moroccan feast with live traditional music.", shortDesc: "Multi-course Moroccan feast under the stars", price: 85, duration: "3 hours", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", category: ExperienceCategory.DINNER, sortOrder: 4 } }),
      prisma.experience.upsert({ where: { slug: "atlas-mountains-excursion" }, update: {}, create: { name: "Atlas Mountains Excursion", slug: "atlas-mountains-excursion", description: "Full-day adventure to the stunning Atlas Mountains. Visit traditional Berber villages, hike through breathtaking valleys, and enjoy lunch at a local family's home.", shortDesc: "Full-day Berber village and mountain hiking adventure", price: 120, duration: "8 hours", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80", category: ExperienceCategory.EXCURSION, sortOrder: 5 } }),
      prisma.experience.upsert({ where: { slug: "moroccan-cooking-class" }, update: {}, create: { name: "Moroccan Cooking Class", slug: "moroccan-cooking-class", description: "Learn the secrets of Moroccan cuisine from our master chef. Market visit, then prepare tagine, couscous, and pastilla.", shortDesc: "Market visit and hands-on cooking with master chef", price: 95, duration: "4 hours", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80", category: ExperienceCategory.COOKING_CLASS, sortOrder: 6 } }),
      prisma.experience.upsert({ where: { slug: "sunset-camel-ride" }, update: {}, create: { name: "Sunset Camel Ride", slug: "sunset-camel-ride", description: "Magical sunset camel ride through the Palmeraie, Marrakech's ancient palm grove. Guided by a local Berber through 150,000 palms.", shortDesc: "Guided sunset ride through the Marrakech Palmeraie", price: 55, duration: "1.5 hours", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80", category: ExperienceCategory.EXCURSION, sortOrder: 7 } }),
      prisma.experience.upsert({ where: { slug: "private-spa-day" }, update: {}, create: { name: "Private Spa Day", slug: "private-spa-day", description: "Full day of pampering: traditional hammam, argan oil body wrap, 90-minute massage, and rejuvenating facial. Concludes with afternoon tea.", shortDesc: "Full-day hammam, massage, wrap and facial package", price: 195, duration: "6 hours", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", category: ExperienceCategory.HAMMAM, sortOrder: 8 } }),
    ]);

    await prisma.galleryImage.deleteMany({});
    await prisma.galleryImage.createMany({
      data: [
        { url: "https://images.unsplash.com/photo-1528360983277?w=800&q=80", caption: "Sultan Suite – Main Bedroom", category: GalleryCategory.ROOMS, sortOrder: 1 },
        { url: "https://images.unsplash.com/photo-1565197722014?w=800&q=80", caption: "Atlas Suite – Living Area", category: GalleryCategory.ROOMS, sortOrder: 2 },
        { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", caption: "Marrakech Room – Bedroom", category: GalleryCategory.ROOMS, sortOrder: 3 },
        { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", caption: "Kasbah Suite – Terrace View", category: GalleryCategory.ROOMS, sortOrder: 4 },
        { url: "https://images.unsplash.com/photo-1577898478989?w=800&q=80", caption: "Riad Garden Room – Bathroom", category: GalleryCategory.ROOMS, sortOrder: 5 },
        { url: "https://images.unsplash.com/photo-1587974928442?w=800&q=80", caption: "Central Courtyard Fountain", category: GalleryCategory.RIAD, sortOrder: 6 },
        { url: "https://images.unsplash.com/photo-1595351298020-038700609878?w=800&q=80", caption: "Rooftop Terrace at Sunset", category: GalleryCategory.RIAD, sortOrder: 7 },
        { url: "https://images.unsplash.com/photo-1548018560-c7196548c7ec?w=800&q=80", caption: "Garden Archways & Tilework", category: GalleryCategory.RIAD, sortOrder: 8 },
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", caption: "Rooftop Dinner Under the Stars", category: GalleryCategory.FOOD, sortOrder: 9 },
        { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80", caption: "Traditional Moroccan Breakfast", category: GalleryCategory.FOOD, sortOrder: 10 },
        { url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80", caption: "Lamb Tagine with Prunes", category: GalleryCategory.FOOD, sortOrder: 11 },
        { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", caption: "Traditional Hammam", category: GalleryCategory.EXPERIENCES, sortOrder: 12 },
        { url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80", caption: "Medina Souks Exploration", category: GalleryCategory.EXPERIENCES, sortOrder: 13 },
        { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80", caption: "Cooking Class with Chef Hassan", category: GalleryCategory.EXPERIENCES, sortOrder: 14 },
        { url: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80", caption: "Sunset Camel Ride – Palmeraie", category: GalleryCategory.EXPERIENCES, sortOrder: 15 },
        { url: "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?w=800&q=80", caption: "Hand-Carved Cedar Ceiling", category: GalleryCategory.DETAILS, sortOrder: 16 },
        { url: "https://images.unsplash.com/photo-1548514814-edca9d5fd82c?w=800&q=80", caption: "Handwoven Berber Textiles", category: GalleryCategory.DETAILS, sortOrder: 17 },
      ],
    });

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
      await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }

    await prisma.review.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.availability.deleteMany({});
    await prisma.booking.deleteMany({});

    type Spec = {
      n: number;
      user: (typeof guests)[number];
      room: (typeof rooms)[number];
      ci: Date; co: Date; nights: number; guests: number;
      status: BookingStatus; ps: PaymentStatus; pm?: PaymentMethod;
      sr?: string;
      msgs?: { a: boolean; c: string }[];
      rev?: { r: number; t: string; c: string };
    };

    const specs: Spec[] = [
      { n: 1, user: sophie, room: sultanSuite, ci: d(-90), co: d(-83), nights: 7, guests: 2, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER, sr: "We would love rose petals on the bed for our anniversary.", msgs: [{ a: false, c: "Bonjour! We are celebrating our 10th anniversary. Could you arrange something special?" }, { a: true, c: "Bienvenue Sophie! We have arranged rose petals, a bottle of Moroccan rosé, and a special turndown service. We look forward to welcoming you!" }, { a: false, c: "Merci beaucoup! We cannot wait!" }], rev: { r: 5, t: "The most magical anniversary trip", c: "Riad Al Baraka exceeded every expectation. The Sultan Suite was breathtaking — the rooftop terrace views at sunset were unforgettable. The hammam experience was divine." } },
      { n: 2, user: james, room: kasbahSuite, ci: d(-75), co: d(-70), nights: 5, guests: 2, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.PAYPAL, msgs: [{ a: false, c: "Hello, is early check-in possible? Our flight arrives at 9am." }, { a: true, c: "Hello James! We can arrange early check-in from 12pm at no extra charge. Would you like us to arrange an airport transfer?" }, { a: false, c: "That would be brilliant, yes please." }, { a: true, c: "Your driver Ahmed will meet you at arrivals with a RiadFlow sign. Safe travels!" }], rev: { r: 5, t: "Absolute luxury in the heart of the medina", c: "The Kasbah Suite is spectacular. The private plunge pool was our favourite spot. The rooftop dinner was a highlight of our entire Morocco trip." } },
      { n: 3, user: maria, room: atlasSuite, ci: d(-60), co: d(-54), nights: 6, guests: 4, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER, msgs: [{ a: false, c: "Hola! We are travelling with our two children. Do you have family-friendly activities?" }, { a: true, c: "¡Bienvenida Maria! We love having families. Our chef prepares a special children's breakfast. We also arrange family cooking classes." }, { a: false, c: "Please book the cooking class for all four of us." }], rev: { r: 5, t: "Perfect family escape — kids loved it!", c: "We came as a family of four and had the most amazing week. Our kids absolutely fell in love with the cooking class." } },
      { n: 4, user: hans, room: medinaView, ci: d(-45), co: d(-42), nights: 3, guests: 2, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.PAYPAL, msgs: [{ a: false, c: "We would like to book the Atlas Mountains excursion." }, { a: true, c: "Of course! The excursion departs at 8am. I'll confirm for day 2 of your stay." }], rev: { r: 4, t: "Wonderful medina experience", c: "A lovely stay in a beautiful room. The views over the medina were exactly as described. The Atlas excursion was the highlight." } },
      { n: 5, user: emma, room: marrakechRoom, ci: d(-30), co: d(-24), nights: 6, guests: 1, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER, msgs: [{ a: false, c: "I'm traveling solo. Are there group activities I can join?" }, { a: true, c: "Welcome Emma! We can connect you with small group medina tours. Our rooftop communal area is great for meeting other guests." }, { a: false, c: "That's so reassuring, thank you!" }], rev: { r: 5, t: "Perfect solo trip — I felt completely safe", c: "As a solo female traveler I was a little nervous about Marrakech, but this riad made me feel completely at home. Already planning to return." } },
      { n: 6, user: yuki, room: gardenRoom, ci: d(-20), co: d(-16), nights: 4, guests: 2, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.CASH_ON_ARRIVAL, rev: { r: 5, t: "忘れられない体験 (Unforgettable experience)", c: "Beautiful, authentic riad experience. The staff went out of their way to welcome us, even learning a few Japanese phrases!" } },
      { n: 7, user: ale, room: sultanSuite, ci: d(-15), co: d(-10), nights: 5, guests: 2, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER, msgs: [{ a: false, c: "Ciao! Is it possible to have dinner at the riad every evening?" }, { a: true, c: "Ciao Alessandro! Assolutamente! Shall I arrange the rooftop dinner package for your entire stay?" }, { a: false, c: "Perfetto! Yes please, every evening on the rooftop sounds incredible." }], rev: { r: 5, t: "Paradiso Marocchino — a culinary dream", c: "As Italians, we have high standards — Riad Al Baraka surpassed them completely. The bastilla, the lamb tagine, the harira soup at sunset. Torneremo presto!" } },
      { n: 8, user: priya, room: marrakechRoom, ci: d(-10), co: d(-7), nights: 3, guests: 2, status: BookingStatus.COMPLETED, ps: PaymentStatus.PAID, pm: PaymentMethod.PAYPAL, rev: { r: 4, t: "Lovely riad, great location", c: "A really charming riad in a great medina location. The room was comfortable and beautifully decorated. Would recommend and return." } },
      { n: 9, user: sophie, room: kasbahSuite, ci: d(-2), co: d(5), nights: 7, guests: 2, status: BookingStatus.CONFIRMED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER, msgs: [{ a: false, c: "Bonjour! Nous arrivons demain soir vers 20h." }, { a: true, c: "Bonsoir Sophie! Absolument, nous serons là pour vous accueillir à 20h. Bon voyage!" }] },
      { n: 10, user: james, room: atlasSuite, ci: d(0), co: d(6), nights: 6, guests: 3, status: BookingStatus.CONFIRMED, ps: PaymentStatus.PAID, pm: PaymentMethod.PAYPAL, msgs: [{ a: false, c: "We're a group of three friends for a birthday trip. Can you arrange something special?" }, { a: true, c: "We'll arrange a birthday cake, decorations, and complimentary cocktails on the rooftop! What's the birthday date?" }, { a: false, c: "His name is Tom and his birthday is June 13. You're amazing!" }] },
      { n: 11, user: emma, room: sultanSuite, ci: d(8), co: d(15), nights: 7, guests: 2, status: BookingStatus.CONFIRMED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER, sr: "Honeymoon trip!", msgs: [{ a: false, c: "We're coming for our honeymoon! Any special packages?" }, { a: true, c: "Mabrouk! We have a honeymoon package: rose petals, Moroccan wine, couples hammam, and private rooftop dinner. Shall I add all of these?" }, { a: false, c: "Yes please to everything!" }] },
      { n: 12, user: hans, room: gardenRoom, ci: d(12), co: d(17), nights: 5, guests: 2, status: BookingStatus.CONFIRMED, ps: PaymentStatus.PAID, pm: PaymentMethod.BANK_TRANSFER },
      { n: 13, user: ale, room: medinaView, ci: d(20), co: d(25), nights: 5, guests: 2, status: BookingStatus.CONFIRMED, ps: PaymentStatus.PAID, pm: PaymentMethod.PAYPAL, msgs: [{ a: false, c: "Is it possible to arrange a private cooking class for just the two of us?" }, { a: true, c: "Assolutamente! Chef Hassan will take you to the market first. Which morning works best?" }] },
      { n: 14, user: maria, room: kasbahSuite, ci: d(30), co: d(37), nights: 7, guests: 2, status: BookingStatus.CONFIRMED, ps: PaymentStatus.PENDING_VERIFICATION, pm: PaymentMethod.BANK_TRANSFER, msgs: [{ a: false, c: "We have transferred the deposit. Can you confirm receipt?" }, { a: true, c: "Hola Maria! We have received your transfer — it's being verified. We'll send confirmation once approved. Muy emocionados!" }] },
      { n: 15, user: priya, room: sultanSuite, ci: d(45), co: d(50), nights: 5, guests: 2, status: BookingStatus.PENDING, ps: PaymentStatus.UNPAID, msgs: [{ a: false, c: "I've just submitted my booking. What are the payment options?" }, { a: true, c: "Hello Priya! You can pay by bank transfer, PayPal, or cash on arrival. A 30% deposit confirms your reservation." }] },
      { n: 16, user: yuki, room: marrakechRoom, ci: d(60), co: d(65), nights: 5, guests: 2, status: BookingStatus.PENDING, ps: PaymentStatus.UNPAID },
      { n: 17, user: james, room: medinaView, ci: d(-50), co: d(-47), nights: 3, guests: 1, status: BookingStatus.CANCELLED, ps: PaymentStatus.REFUNDED, pm: PaymentMethod.PAYPAL, msgs: [{ a: false, c: "Unfortunately I need to cancel. There's been a family emergency." }, { a: true, c: "We are so sorry. Your booking has been cancelled and a full refund initiated. Don't hesitate to rebook — we'll offer you a special rate." }] },
    ];

    for (const spec of specs) {
      const ppn = Number(spec.room.pricePerNight);
      const total = ppn * spec.nights;
      const deposit = total * 0.3;

      const booking = await prisma.booking.create({
        data: {
          bookingNumber: bn(spec.n),
          userId: spec.user.id,
          roomId: spec.room.id,
          checkIn: spec.ci,
          checkOut: spec.co,
          guests: spec.guests,
          guestName: spec.user.name!,
          guestEmail: spec.user.email,
          guestPhone: spec.user.phone ?? "",
          specialRequests: spec.sr,
          totalNights: spec.nights,
          pricePerNight: ppn,
          totalAmount: total,
          depositAmount: deposit,
          bookingStatus: spec.status,
          paymentStatus: spec.ps,
          paymentMethod: spec.pm,
          paymentVerifiedAt: spec.ps === PaymentStatus.PAID ? new Date(spec.ci.getTime() - 5 * 86400000) : undefined,
          paymentVerifiedBy: spec.ps === PaymentStatus.PAID ? admin.id : undefined,
          completedAt: spec.status === BookingStatus.COMPLETED ? spec.co : undefined,
          cancelledAt: spec.status === BookingStatus.CANCELLED ? new Date() : undefined,
          cancelReason: spec.status === BookingStatus.CANCELLED ? "Guest family emergency — full refund issued." : undefined,
          createdAt: new Date(spec.ci.getTime() - 21 * 86400000),
        },
      });

      if (spec.status !== BookingStatus.CANCELLED && spec.status !== BookingStatus.PENDING) {
        const cur = new Date(spec.ci);
        while (cur < spec.co) {
          await prisma.availability.upsert({
            where: { roomId_date: { roomId: spec.room.id, date: new Date(cur) } },
            update: { isBlocked: true, bookingId: booking.id },
            create: { roomId: spec.room.id, date: new Date(cur), isBlocked: true, bookingId: booking.id },
          });
          cur.setDate(cur.getDate() + 1);
        }
      }

      if (spec.msgs) {
        for (const msg of spec.msgs) {
          await prisma.message.create({ data: { bookingId: booking.id, senderId: msg.a ? admin.id : spec.user.id, content: msg.c, isRead: true } });
        }
      }

      if (spec.rev && spec.status === BookingStatus.COMPLETED) {
        await prisma.review.create({
          data: {
            bookingId: booking.id,
            roomId: spec.room.id,
            userId: spec.user.id,
            rating: spec.rev.r,
            title: spec.rev.t,
            content: spec.rev.c,
            isApproved: true,
            isVisible: true,
            createdAt: new Date(spec.co.getTime() + 3 * 86400000),
          },
        });
      }
    }

    return { success: true, message: "Database seeded successfully with full demo data!" };
  } catch (error: unknown) {
    const err = error as { message?: string };
    throw new Error(err.message ?? "Seed failed");
  }
}

export async function GET() {
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const secret = process.env.SEED_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
