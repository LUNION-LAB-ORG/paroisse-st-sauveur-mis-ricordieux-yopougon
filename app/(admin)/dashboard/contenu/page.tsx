"use client"

import { Users } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"

export default function ContenuPage() {
  return (
    <div>
      <Header title="Gestion du Contenu" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard icon={Users} value="25" label="Pages publiées" trend="12%" trendUp />
        <StatCard icon={Users} value="10" label="Médias" trend="12%" trendUp />
        <StatCard icon={Users} value="05" label="Documents" trend="12%" trendUp />
      </div>

      <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-100 shadow-sm text-center">
        <Users className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-[#2d2d83]/30 mb-4" />
        <h2 className="text-lg lg:text-xl font-semibold text-[#2d2d83] mb-2">Gestion du contenu</h2>
        <p className="text-sm lg:text-base text-gray-500">
          Cette section permet de gérer les pages, médias et documents de la paroisse.
        </p>
      </div>
    </div>
  )
}
