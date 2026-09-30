import type React from "react";

import { MenuLateral } from "@/components/admin/menu-lateral";

export const dynamic = "force-dynamic";

/** Gabarit du back-office : menu latéral marine (260 px) + contenu sur fond #F4F2EE. */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-fond-admin font-body text-encre">
      <MenuLateral />
      <main className="flex min-h-screen min-w-0 flex-col lg:pl-[260px]">
        {children}
      </main>
    </div>
  );
}
