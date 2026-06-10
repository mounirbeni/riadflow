# RiadFlow — Agent Coordination Spec

## Shared Contracts

### Tech Stack (Fixed)
- Next.js 15 (App Router)
- TypeScript 5.x
- Tailwind CSS v4
- shadcn/ui (latest)
- Prisma 5.x + PostgreSQL
- NextAuth.js v5 (Auth.js)
- Resend (email)
- Cloudinary (images)
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (charts)
- React Hook Form + Zod (forms)

### Color Tokens (Tailwind Config)
```js
colors: {
  sand: {
    50: '#FAF7F2', 100: '#F5EFE6', 200: '#E8DCC8', 300: '#D4C4A8',
    400: '#B8A080', 500: '#9A8260', 600: '#7A6548', 700: '#5C4A32',
    800: '#3D3020', 900: '#1F180F',
  },
  terracotta: {
    50: '#FDF2EE', 100: '#FCE5DB', 200: '#F9C9B8', 300: '#F5A88E',
    400: '#E88468', 500: '#D4684A', 600: '#B8543A', 700: '#944030',
  },
  olive: {
    50: '#F4F7F0', 100: '#E8F0E0', 200: '#C8D9B8', 300: '#A3C48A',
    400: '#7AAF5C', 500: '#5C9440', 600: '#4A7834',
  },
  gold: {
    50: '#FDF8F0', 100: '#FBF0E0', 200: '#F5E0C0', 300: '#E8C88A',
    400: '#D4A84A', 500: '#C4942E', 600: '#A07824',
  },
}
```

### Font Stack
- Headings: `font-family: 'Playfair Display', serif;`
- Body: `font-family: 'Inter', sans-serif;`
- Accent: `font-family: 'Cormorant Garamond', serif;` (italic)

### Glass Card Component
```tsx
// components/shared/glass-card.tsx
export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl",
      className
    )}>
      {children}
    </div>
  );
}
```

### Zellige Pattern SVG
Use subtle SVG pattern as background on hero sections. Low opacity (5-10%).

### API Response Shape
All API responses use:
```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Auth Session Shape (NextAuth)
```ts
interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: 'GUEST' | 'ADMIN';
  }
}
```

### Route Protection
- Public routes: No auth required
- Guest routes: `middleware.ts` checks for session, redirects to /login
- Admin routes: `middleware.ts` checks `session.user.role === 'ADMIN'`, redirects to /dashboard

### Prisma Client Singleton
```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Cloudinary Upload
Use server-side upload with `cloudinary.v2.uploader.upload()`.

### Resend Email
Use `resend.emails.send()` with React Email components.

## Worker Assignments

### Worker: Designer (Phase 1)
- **Scope**: Create design.md with full visual system, page layouts, component specs
- **Output**: `design/design.md`, `design/home.md`, `design/rooms.md`, `design/dashboard.md`, `design/admin.md`
- **Forbidden**: No code implementation

### Worker: Scaffold (Phase 2)
- **Scope**: Initialize Next.js project, install all deps, configure Tailwind, Prisma, NextAuth, Cloudinary, Resend. Create base layout, shared components, seed data.
- **Output**: Full project scaffold with working dev server
- **Forbidden**: No page implementations beyond home page stub

### Worker A: Public Website (Phase 3)
- **Scope**: All public pages — Home, Rooms, Room Detail, Experiences, Gallery, About, Contact, Booking
- **Dependencies**: Scaffold baseline
- **Allowed edits**: `app/(public)/`, `components/public/`, `app/api/rooms/`, `app/api/experiences/`, `app/api/gallery/`, `app/api/contact/`, `app/api/reviews/`
- **Forbidden**: Auth pages, dashboard pages, admin pages, admin API routes

### Worker B: Auth & Guest Dashboard (Phase 3)
- **Scope**: Auth pages (login, register, forgot-password), Guest dashboard (overview, bookings, messages, invoices, profile)
- **Dependencies**: Scaffold baseline
- **Allowed edits**: `app/(auth)/`, `app/(dashboard)/`, `components/dashboard/`, `app/api/auth/`, `app/api/bookings/`, `app/api/guest/`
- **Forbidden**: Public pages, admin pages, admin API routes

### Worker C: Admin Dashboard (Phase 3)
- **Scope**: All admin pages — Analytics, Bookings, Rooms, Guests, Payments, Calendar, Reviews, Messages, Gallery, Settings
- **Dependencies**: Scaffold baseline
- **Allowed edits**: `app/(admin)/`, `components/admin/`, `app/api/admin/`
- **Forbidden**: Public pages, auth pages, guest dashboard pages

### Worker D: Backend API & Emails (Phase 3)
- **Scope**: All API routes, booking logic, payment flow, messaging, reviews, email templates, availability calendar
- **Dependencies**: Scaffold baseline
- **Allowed edits**: `app/api/`, `lib/`, `emails/`, `hooks/`, `types/`
- **Forbidden**: Page components (UI), layout files

## Merge Order
1. Scaffold baseline (main branch)
2. Worker D (backend API) — other workers depend on API contracts
3. Worker A + Worker B + Worker C (parallel, after Worker D APIs are stable)
4. Final integration and fixes

## Validation Commands
```bash
npm run build      # Must pass
npm run lint       # Should pass
npx tsc --noEmit   # Type check
```

## Environment Variables Required
```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
RESEND_API_KEY="..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```
