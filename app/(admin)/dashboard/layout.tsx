import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"

export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="p-4 pt-16 lg:pt-8 lg:ml-72 lg:p-8">{children}</main>
    </div>
  )
}
