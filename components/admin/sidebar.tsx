"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Flame,
  Volume2,
  Calendar,
  CalendarPlus,
  Heart,
  FileEdit,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Church,
  Bell,
  Clock,
  CalendarHeart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { notificationAPI } from "@/features/notification/apis/notification.api"

const menuItems = [
  { label: "Tableau de bord", icon: LayoutGrid, href: "/dashboard" },
  { label: "Messes", icon: Flame, href: "/dashboard/messes" },
  { label: "Écoutes", icon: Volume2, href: "/dashboard/ecoutes" },
  { label: "Événements", icon: Calendar, href: "/dashboard/evenements" },
  { label: "Demandes d'événements", icon: CalendarPlus, href: "/dashboard/organisations" },
  { label: "Dons", icon: Heart, href: "/dashboard/dons" },
  { label: "Curés", icon: Church, href: "/dashboard/cure" },
  { label: "Horaires & Créneaux", icon: Clock, href: "/dashboard/horaires" },
]

const contentItems = [
  { label: "Méditations", icon: FileEdit, href: "/dashboard/mediation" },
  { label: "Actualités", icon: Newspaper, href: "/dashboard/actualites" },
  { label: "Mouvements", icon: Users, href: "/dashboard/mouvements" },
  { label: "Programmations", icon: CalendarHeart, href: "/dashboard/programmations" },
]

const adminItems = [
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Utilisateurs", icon: Users, href: "/dashboard/utilisateurs" },
  { label: "Mon profil", icon: Users, href: "/dashboard/profil" },
  { label: "Paramètres", icon: Settings, href: "/dashboard/parametres" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadNotifs, setUnreadNotifs] = useState<number>(0)

  // Poll le nombre de notifications non lues
  useEffect(() => {
    let mounted = true
    const tick = async () => {
      try {
        const res = await notificationAPI.nombreNonLues()
        if (mounted) setUnreadNotifs(res.count ?? 0)
      } catch {
        // silencieux — l'admin peut être déconnecté
      }
    }
    tick()
    const interval = setInterval(tick, 30000) // toutes les 30s
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Refresh quand on arrive sur la page notifications (probable: marquage lus)
  useEffect(() => {
    if (pathname === "/dashboard/notifications") {
      notificationAPI.nombreNonLues().then((r) => setUnreadNotifs(r.count ?? 0)).catch(() => {})
    }
  }, [pathname])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-[10px] bg-[#2d2d83] text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-[#2d2d83] text-white flex flex-col z-40 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-6 pt-16 lg:pt-6 flex items-center gap-3 shrink-0 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src="/assets/images/logo-paroise.png"
              alt="Logo Paroisse"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-white truncate text-sm">Paroisse St Sauveur</h2>
            <p className="text-xs text-white/60 truncate">Miséricordieux</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4 overflow-y-auto scrollbar-thin pb-6">
          <div className="mb-6">
            <p className="px-3 mb-3 text-[11px] font-semibold text-white/40 uppercase tracking-widest">
              Menu principal
            </p>
            <ul className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-sm font-medium",
                        isActive
                          ? "bg-[#98141f] text-white shadow-md shadow-black/20"
                          : "text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mb-6">
            <p className="px-3 mb-3 text-[11px] font-semibold text-white/40 uppercase tracking-widest">
              Contenu
            </p>
            <ul className="space-y-0.5">
              {contentItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-sm font-medium",
                        isActive
                          ? "bg-[#98141f] text-white shadow-md shadow-black/20"
                          : "text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="px-3 mb-3 text-[11px] font-semibold text-white/40 uppercase tracking-widest">
              Administration
            </p>
            <ul className="space-y-0.5">
              {adminItems.map((item) => {
                const isActive = pathname === item.href
                const badge =
                  item.href === "/dashboard/notifications" && unreadNotifs > 0
                    ? unreadNotifs
                    : null
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-sm font-medium relative",
                        isActive
                          ? "bg-[#98141f] text-white shadow-md shadow-black/20"
                          : "text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      <span className="flex-1">{item.label}</span>
                      {badge !== null && (
                        <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-[#98141f] text-white text-[11px] font-semibold border border-white/10 shadow-sm">
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Deconnexion + Footer */}
        <div className="px-3 pb-2 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-sm font-medium text-white/75 hover:bg-red-500/20 hover:text-red-300 w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Déconnexion</span>
          </button>
        </div>
        <div className="px-4 py-3 border-t border-white/10 shrink-0">
          <p className="text-[11px] text-white/30 text-center">&copy; {new Date().getFullYear()} Paroisse St Sauveur</p>
        </div>
      </aside>
    </>
  )
}
