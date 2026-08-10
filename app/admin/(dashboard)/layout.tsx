import type { ReactNode } from "react";

import AdminProtected from "@/components/admin/admin-protected";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminProtected>
      <div className="flex min-h-screen bg-[#eee8df] text-[#14243f]">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />
          <main className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProtected>
  );
}
