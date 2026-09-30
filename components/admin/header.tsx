"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { notificationAPI } from "@/features/notification/apis/notification.api";

interface HeaderProps {
  title: string;
  /** Conservé pour compatibilité avec les anciens écrans */
  showSearch?: boolean;
}

/**
 * En-tête des modules du groupe « Autres » (anciens écrans conservés) : même
 * barre blanche que les écrans de la maquette, pleine largeur dans le gabarit
 * `components/admin/ancien-module.tsx`.
 */
export function Header({ title }: HeaderProps) {
  const [nonLues, setNonLues] = useState(0);

  useEffect(() => {
    let actif = true;
    const lire = async () => {
      try {
        const r = await notificationAPI.nombreNonLues();

        if (actif) setNonLues(r.count ?? 0);
      } catch {
        /* session expirée : ignoré */
      }
    };

    void lire();
    const minuterie = setInterval(lire, 30000);

    return () => {
      actif = false;
      clearInterval(minuterie);
    };
  }, []);

  return (
    <header className="-mx-4 -mt-6 mb-6 flex min-h-[76px] items-center justify-between gap-4 border-b border-bord-admin bg-white px-4 py-4 md:-mx-9 md:px-9">
      <h1 className="m-0 font-heading text-xl font-extrabold text-marine md:text-[22px]">
        {title}
      </h1>
      <Link
        aria-label={`Notifications${nonLues > 0 ? ` (${nonLues} non lues)` : ""}`}
        className="relative rounded-admin p-2.5 text-gris hover:bg-entete-admin"
        href="/dashboard/notifications"
      >
        <Bell aria-hidden className="size-5" />
        {nonLues > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-white bg-rouge px-1 text-[10px] font-bold text-white">
            {nonLues > 99 ? "99+" : nonLues}
          </span>
        )}
      </Link>
    </header>
  );
}
