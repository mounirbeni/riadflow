import { AdminSidebar } from "@/components/shared/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6">{children}</main>
    </div>
  );
}
