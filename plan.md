# RiadFlow — Luxury Riad Booking SaaS

## Project Overview
Build a full-stack luxury riad booking platform called **RiadFlow** with:
- Public marketing website (home, rooms, experiences, gallery, about, contact, booking)
- Guest authentication & dashboard
- Admin protected dashboard with analytics
- Full booking system with availability calendar
- Payment proof upload & verification
- In-app messaging between guest and admin
- Review system
- Email notifications via Resend
- Cloudinary image uploads

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (Auth.js)
- **Email**: Resend
- **Images**: Cloudinary
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## Design System — Premium Moroccan Luxury

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| sand-50 | #FAF7F2 | Page backgrounds |
| sand-100 | #F5EFE6 | Card backgrounds, sections |
| sand-200 | #E8DCC8 | Borders, dividers |
| sand-300 | #D4C4A8 | Muted text, icons |
| sand-400 | #B8A080 | Secondary text |
| sand-500 | #9A8260 | Accent muted |
| sand-600 | #7A6548 | Body text on light |
| sand-700 | #5C4A32 | Headings on light |
| sand-800 | #3D3020 | Dark headings |
| sand-900 | #1F180F | Darkest text |
| terracotta-50 | #FDF2EE | Light terracotta bg |
| terracotta-100 | #FCE5DB | Terracotta tint |
| terracotta-200 | #F9C9B8 | Hover states |
| terracotta-300 | #F5A88E | Accent highlights |
| terracotta-400 | #E88468 | Primary accent |
| terracotta-500 | #D4684A | Primary CTA |
| terracotta-600 | #B8543A | CTA hover |
| terracotta-700 | #944030 | Dark accent |
| olive-50 | #F4F7F0 | Light olive bg |
| olive-100 | #E8F0E0 | Olive tint |
| olive-200 | #C8D9B8 | Borders |
| olive-300 | #A3C48A | Success states |
| olive-400 | #7AAF5C | Success |
| olive-500 | #5C9440 | Primary success |
| olive-600 | #4A7834 | Success hover |
| gold-50 | #FDF8F0 | Light gold bg |
| gold-100 | #FBF0E0 | Gold tint |
| gold-200 | #F5E0C0 | Gold highlights |
| gold-300 | #E8C88A | Gold accent |
| gold-400 | #D4A84A | Premium gold |
| gold-500 | #C4942E | Gold CTA |
| gold-600 | #A07824 | Gold hover |

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (clean, readable)
- **Accent/Labels**: Cormorant Garamond (italic for luxury feel)

### Visual Elements
- Zellige pattern SVG backgrounds (subtle, low opacity)
- Glass morphism cards: `bg-white/70 backdrop-blur-md border border-white/20`
- Smooth scroll with Lenis
- Framer Motion page transitions
- Mobile-first with bottom nav for guest dashboard
- Clean sidebar for admin dashboard

### Spacing
- Generous whitespace (luxury feel)
- Section padding: py-20 to py-32
- Card padding: p-6 to p-8
- Border radius: rounded-2xl for cards, rounded-full for buttons

## Database Schema (Prisma)

### Models
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // hashed, for credentials provider
  image         String?
  role          Role      @default(GUEST)
  phone         String?
  country       String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  bookings      Booking[]
  messages      Message[]
  reviews       Review[]
  accounts      Account[]
  sessions      Session[]
}

enum Role {
  GUEST
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Room {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  shortDesc   String?
  pricePerNight Decimal @db.Decimal(10, 2)
  capacity    Int
  beds        String
  bathrooms   Int      @default(1)
  size        Int?     // in sq meters
  amenities   String[] // array of amenity names
  images      String[] // Cloudinary URLs
  isActive    Boolean  @default(true)
  featured    Boolean  @default(false)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  bookings    Booking[]
  reviews     Review[]
  availability Availability[]
}

model Availability {
  id        String   @id @default(cuid())
  roomId    String
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  date      DateTime @db.Date
  isBlocked Boolean  @default(false)
  bookingId String?
  booking   Booking? @relation(fields: [bookingId], references: [id])
  @@unique([roomId, date])
}

model Booking {
  id              String          @id @default(cuid())
  bookingNumber   String          @unique
  userId          String
  user            User            @relation(fields: [userId], references: [id])
  roomId          String
  room            Room            @relation(fields: [roomId], references: [id])
  checkIn         DateTime        @db.Date
  checkOut        DateTime        @db.Date
  guests          Int
  guestName       String
  guestEmail      String
  guestPhone      String
  specialRequests String?         @db.Text
  totalNights     Int
  pricePerNight   Decimal         @db.Decimal(10, 2)
  totalAmount     Decimal         @db.Decimal(10, 2)
  depositAmount   Decimal         @db.Decimal(10, 2)
  bookingStatus   BookingStatus   @default(PENDING)
  paymentStatus   PaymentStatus   @default(UNPAID)
  paymentMethod   PaymentMethod?
  paymentProof    String?         // Cloudinary URL
  paymentProofUploadedAt DateTime?
  paymentVerifiedAt DateTime?
  paymentVerifiedBy String?
  cancelledAt     DateTime?
  cancelReason    String?
  completedAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  messages        Message[]
  availability    Availability[]
  review          Review?
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  UNPAID
  PENDING_VERIFICATION
  PAID
  REFUNDED
}

enum PaymentMethod {
  BANK_TRANSFER
  PAYPAL
  CASH_ON_ARRIVAL
}

model Message {
  id        String   @id @default(cuid())
  bookingId String
  booking   Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id])
  content   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Review {
  id        String   @id @default(cuid())
  bookingId String   @unique
  booking   Booking  @relation(fields: [bookingId], references: [id])
  roomId    String
  room      Room     @relation(fields: [roomId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  rating    Int      // 1-5
  title     String?
  content   String   @db.Text
  isApproved Boolean @default(false)
  isVisible Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Experience {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  shortDesc   String?
  price       Decimal  @db.Decimal(10, 2)
  duration    String
  image       String
  category    ExperienceCategory
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ExperienceCategory {
  HAMMAM
  MEDINA_TOUR
  AIRPORT_TRANSFER
  DINNER
  EXCURSION
  COOKING_CLASS
}

model GalleryImage {
  id        String   @id @default(cuid())
  url       String
  caption   String?
  category  GalleryCategory
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

enum GalleryCategory {
  ROOMS
  RIAD
  FOOD
  EXPERIENCES
  DETAILS
}

model SiteSetting {
  id          String  @id @default(cuid())
  key         String  @unique
  value       String  @db.Text
  updatedAt   DateTime @updatedAt
}
```

## API Routes (Next.js App Router)

### Public API
- `GET /api/rooms` — List rooms with filters
- `GET /api/rooms/[slug]` — Room detail
- `GET /api/rooms/[id]/availability` — Check availability
- `GET /api/experiences` — List experiences
- `GET /api/gallery` — List gallery images
- `GET /api/reviews` — List approved reviews
- `POST /api/contact` — Contact form

### Auth API (NextAuth.js)
- `/api/auth/[...nextauth]` — NextAuth handlers
- Credentials provider (email/password)
- Google OAuth provider

### Protected Guest API
- `GET /api/bookings` — My bookings
- `POST /api/bookings` — Create booking
- `GET /api/bookings/[id]` — Booking detail
- `POST /api/bookings/[id]/cancel` — Cancel booking
- `POST /api/bookings/[id]/payment-proof` — Upload payment proof
- `GET /api/bookings/[id]/messages` — Get messages
- `POST /api/bookings/[id]/messages` — Send message
- `POST /api/reviews` — Create review (after completed stay)
- `GET /api/guest/dashboard` — Dashboard overview
- `PUT /api/guest/profile` — Update profile

### Protected Admin API
- `GET /api/admin/analytics` — Dashboard analytics
- `GET /api/admin/bookings` — All bookings
- `PUT /api/admin/bookings/[id]/status` — Update booking status
- `PUT /api/admin/bookings/[id]/payment` — Verify payment
- `GET /api/admin/rooms` — Room management
- `POST /api/admin/rooms` — Create room
- `PUT /api/admin/rooms/[id]` — Update room
- `DELETE /api/admin/rooms/[id]` — Delete room
- `GET /api/admin/guests` — Guest list
- `GET /api/admin/payments` — Payment list
- `GET /api/admin/reviews` — Review management
- `PUT /api/admin/reviews/[id]/approve` — Approve review
- `GET /api/admin/messages` — All messages
- `GET /api/admin/settings` — Site settings
- `PUT /api/admin/settings` — Update settings
- `POST /api/admin/gallery` — Upload gallery image
- `DELETE /api/admin/gallery/[id]` — Delete gallery image

## Page Routes

### Public Pages
- `/` — Home (cinematic hero, rooms preview, experiences, breakfast, reviews, CTA)
- `/rooms` — Rooms listing with filters
- `/rooms/[slug]` — Room detail with gallery, amenities, booking form
- `/experiences` — Experiences listing
- `/gallery` — Photo gallery
- `/about` — About the riad
- `/contact` — Contact with WhatsApp button
- `/booking` — Booking flow

### Auth Pages
- `/login` — Guest login
- `/register` — Guest signup
- `/forgot-password` — Password reset

### Guest Dashboard (Protected)
- `/dashboard` — Overview
- `/dashboard/bookings` — Booking history
- `/dashboard/bookings/[id]` — Booking detail with messaging
- `/dashboard/messages` — All messages
- `/dashboard/invoices` — Invoices
- `/dashboard/profile` — Profile settings

### Admin Dashboard (Protected, Admin Only)
- `/admin` — Analytics overview
- `/admin/bookings` — All bookings
- `/admin/bookings/[id]` — Booking detail
- `/admin/rooms` — Room management
- `/admin/rooms/[id]/edit` — Edit room
- `/admin/rooms/new` — Create room
- `/admin/guests` — Guest management
- `/admin/payments` — Payment verification
- `/admin/calendar` — Availability calendar
- `/admin/reviews` — Review management
- `/admin/messages` — All messages
- `/admin/gallery` — Gallery management
- `/admin/settings` — Site settings

## Email Templates (Resend)
1. **Welcome Email** — After registration
2. **Booking Created** — Guest + Admin alert
3. **Payment Proof Received** — Admin alert
4. **Payment Verified** — Guest notification
5. **Booking Confirmed** — Guest notification
6. **Booking Cancelled** — Guest + Admin
7. **New Message** — Notification

## Implementation Phases

### Phase 1: Design & Architecture
- Create design.md with full visual system
- Create database schema
- Define API contracts
- Define component architecture

### Phase 2: Project Scaffold
- Initialize Next.js project with App Router
- Install all dependencies
- Configure Tailwind with custom theme
- Set up Prisma with PostgreSQL
- Set up NextAuth.js
- Set up Cloudinary
- Set up Resend
- Create base layout, fonts, global styles
- Create shared components (Navbar, Footer, GlassCard, etc.)
- Seed database with sample data

### Phase 3: Parallel Implementation
- **Worker A**: Public Website (Home, Rooms, Room Detail, Experiences, Gallery, About, Contact, Booking)
- **Worker B**: Auth & Guest Dashboard (Login, Register, Forgot Password, Guest Dashboard pages)
- **Worker C**: Admin Dashboard (All admin pages, analytics, room management, calendar)
- **Worker D**: Backend API (All API routes, booking logic, payment flow, messaging, reviews, emails)

### Phase 4: Integration & Final Validation
- Merge all workers
- Wire up all routes
- Test full booking flow
- Test auth flows
- Test admin flows
- Verify responsive design
- Final build and validation

## File Structure
```
riadflow/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Home
│   │   ├── rooms/
│   │   │   ├── page.tsx               # Rooms list
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Room detail
│   │   ├── experiences/
│   │   │   └── page.tsx               # Experiences
│   │   ├── gallery/
│   │   │   └── page.tsx               # Gallery
│   │   ├── about/
│   │   │   └── page.tsx               # About
│   │   ├── contact/
│   │   │   └── page.tsx               # Contact
│   │   └── booking/
│   │       └── page.tsx               # Booking flow
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx               # Login
│   │   ├── register/
│   │   │   └── page.tsx               # Register
│   │   └── forgot-password/
│   │       └── page.tsx               # Forgot password
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Guest dashboard layout (bottom nav)
│   │   ├── page.tsx                   # Dashboard overview
│   │   ├── bookings/
│   │   │   ├── page.tsx               # My bookings
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Booking detail
│   │   ├── messages/
│   │   │   └── page.tsx               # Messages
│   │   ├── invoices/
│   │   │   └── page.tsx               # Invoices
│   │   └── profile/
│   │       └── page.tsx               # Profile
│   ├── (admin)/
│   │   ├── layout.tsx                 # Admin layout (sidebar)
│   │   ├── page.tsx                   # Admin analytics
│   │   ├── bookings/
│   │   │   ├── page.tsx               # All bookings
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Booking detail
│   │   ├── rooms/
│   │   │   ├── page.tsx               # Room list
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Create room
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx       # Edit room
│   │   ├── guests/
│   │   │   └── page.tsx               # Guest list
│   │   ├── payments/
│   │   │   └── page.tsx               # Payments
│   │   ├── calendar/
│   │   │   └── page.tsx               # Calendar
│   │   ├── reviews/
│   │   │   └── page.tsx               # Reviews
│   │   ├── messages/
│   │   │   └── page.tsx               # Messages
│   │   ├── gallery/
│   │   │   └── page.tsx               # Gallery mgmt
│   │   └── settings/
│   │       └── page.tsx               # Settings
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts               # NextAuth
│   │   ├── rooms/
│   │   │   ├── route.ts               # List rooms
│   │   │   └── [slug]/
│   │   │       └── route.ts           # Room detail
│   │   ├── bookings/
│   │   │   ├── route.ts               # Create/list
│   │   │   └── [id]/
│   │   │       ├── route.ts           # Get/update
│   │   │       ├── cancel/
│   │   │       │   └── route.ts       # Cancel
│   │   │       ├── payment-proof/
│   │   │       │   └── route.ts       # Upload proof
│   │   │       └── messages/
│   │   │           └── route.ts       # Messages
│   │   ├── experiences/
│   │   │   └── route.ts               # List experiences
│   │   ├── gallery/
│   │   │   └── route.ts               # List gallery
│   │   ├── reviews/
│   │   │   └── route.ts               # Create/list
│   │   ├── contact/
│   │   │   └── route.ts               # Contact form
│   │   ├── guest/
│   │   │   └── dashboard/
│   │   │       └── route.ts           # Guest dashboard data
│   │   └── admin/
│   │       ├── analytics/
│   │       │   └── route.ts           # Analytics
│   │       ├── bookings/
│   │       │   └── route.ts           # All bookings
│   │       ├── rooms/
│   │       │   └── route.ts           # Room CRUD
│   │       ├── guests/
│   │       │   └── route.ts           # Guest list
│   │       ├── payments/
│   │       │   └── route.ts           # Payments
│   │       ├── reviews/
│   │       │   └── route.ts           # Reviews
│   │       ├── messages/
│   │       │   └── route.ts           # Messages
│   │       ├── gallery/
│   │       │   └── route.ts           # Gallery mgmt
│   │       └── settings/
│   │           └── route.ts           # Settings
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Global styles
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── public/                         # Public site components
│   ├── dashboard/                      # Guest dashboard components
│   ├── admin/                          # Admin dashboard components
│   └── shared/                         # Shared components
├── lib/
│   ├── prisma.ts                       # Prisma client
│   ├── auth.ts                         # Auth config
│   ├── cloudinary.ts                   # Cloudinary config
│   ├── resend.ts                       # Resend config
│   ├── utils.ts                        # Utilities
│   └── constants.ts                    # Constants
├── hooks/
│   ├── use-auth.ts
│   ├── use-bookings.ts
│   └── use-messages.ts
├── types/
│   └── index.ts                        # TypeScript types
├── emails/
│   ├── welcome.tsx
│   ├── booking-created.tsx
│   ├── payment-verified.tsx
│   ├── booking-confirmed.tsx
│   ├── booking-cancelled.tsx
│   └── admin-alert.tsx
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Validation Checklist
- [ ] All public pages render correctly
- [ ] Auth flow works (login, register, forgot password)
- [ ] Guest can create booking
- [ ] Availability calendar prevents double booking
- [ ] Guest dashboard shows correct data
- [ ] Admin can approve/reject/cancel/complete bookings
- [ ] Payment proof upload works
- [ ] Admin can verify payments
- [ ] Messaging works between guest and admin
- [ ] Reviews can be submitted and approved
- [ ] Email notifications sent correctly
- [ ] All routes are protected appropriately
- [ ] Mobile responsive with bottom nav
- [ ] Admin sidebar works on desktop
- [ ] Build succeeds without errors
- [ ] TypeScript types are correct
