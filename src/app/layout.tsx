import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RiadFlow — Luxury Moroccan Riad Booking",
  description: "Experience authentic Moroccan luxury. Book exquisite riads, hammam treatments, medina tours, and curated experiences in the heart of Morocco.",
  keywords: ["riad", "morocco", "luxury", "booking", "marrakech", "hammam", "medina", "travel"],
  openGraph: {
    title: "RiadFlow — Luxury Moroccan Riad Booking",
    description: "Experience authentic Moroccan luxury in exquisite riads.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand-50 text-sand-900">
        <SessionProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
