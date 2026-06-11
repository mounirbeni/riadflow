import { MobileNav } from "@/components/shared/mobile-nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      {children}
      {/* Spacer so content isn't hidden behind the fixed mobile nav */}
      <div className="h-14 md:hidden" aria-hidden="true" />
      <MobileNav />
    </div>
  );
}
