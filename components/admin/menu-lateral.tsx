"use client";

import type { IModule } from "@/features/admin/utils/roles";

import { useQuery } from "@tanstack/react-query";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { Compteur } from "@/components/admin/ui/kit";
import { adminAPI } from "@/features/admin/apis/admin.api";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { LOGO_PAR_DEFAUT } from "@/lib/charte";
import { cn } from "@/lib/utils";

interface IEntree {
  label: string;
  href: string;
  module: IModule;
  compteur?: "messes" | "rendez-vous" | "commentaires";
}

const GROUPES: { titre?: string; entrees: IEntree[] }[] = [
  {
    entrees: [
      { label: "Tableau de bord", href: "/dashboard", module: "tableau" },
    ],
  },
  {
    titre: "Contenus",
    entrees: [
      {
        label: "Parole du jour et homélie",
        href: "/dashboard/liturgie",
        module: "liturgie",
      },
      { label: "Horaires", href: "/dashboard/horaires", module: "horaires" },
      { label: "Annonces", href: "/dashboard/annonces", module: "annonces" },
      {
        label: "Événements",
        href: "/dashboard/evenements",
        module: "evenements",
      },
      {
        label: "Publications",
        href: "/dashboard/publications",
        module: "publications",
      },
      { label: "Actualités", href: "/dashboard/actualites", module: "autres" },
      { label: "Méditations", href: "/dashboard/mediation", module: "autres" },
    ],
  },
  {
    titre: "La paroisse",
    entrees: [
      {
        label: "Mouvements et groupes",
        href: "/dashboard/mouvements",
        module: "mouvements",
      },
      {
        label: "Équipe presbytérale",
        href: "/dashboard/equipe",
        module: "equipe",
      },
      {
        label: "Conseils paroissiaux",
        href: "/dashboard/conseils",
        module: "equipe",
      },
      {
        label: "Histoire et mot du curé",
        href: "/dashboard/histoire",
        module: "histoire",
      },
      {
        label: "Curés successifs",
        href: "/dashboard/cure",
        module: "histoire",
      },
    ],
  },
  {
    titre: "Demandes et finances",
    entrees: [
      {
        label: "Demandes de messe",
        href: "/dashboard/messes",
        module: "messes",
        compteur: "messes",
      },
      {
        label: "Dons et nouvelle église",
        href: "/dashboard/dons",
        module: "dons",
      },
      {
        label: "Rendez-vous",
        href: "/dashboard/rendez-vous",
        module: "rendez-vous",
        compteur: "rendez-vous",
      },
      {
        label: "Commentaires",
        href: "/dashboard/commentaires",
        module: "commentaires",
        compteur: "commentaires",
      },
    ],
  },
  {
    titre: "Administration",
    entrees: [
      {
        label: "Notifications",
        href: "/dashboard/notifications",
        module: "autres",
      },
      {
        label: "Abonnés WhatsApp",
        href: "/dashboard/abonnes",
        module: "abonnes",
      },
      {
        label: "Paramètres et utilisateurs",
        href: "/dashboard/parametres",
        module: "parametres",
      },
    ],
  },
];

const actif = (pathname: string, href: string) =>
  href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

function Lien({
  e,
  pathname,
  compte,
  onNaviguer,
}: {
  e: IEntree;
  pathname: string;
  compte?: number;
  onNaviguer: () => void;
}) {
  const estActif = actif(pathname, e.href);

  return (
    <Link
      aria-current={estActif ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center justify-between gap-2 border-l-[3px] px-5 py-[9px] text-sm no-underline hover:no-underline",
        estActif
          ? "border-ciel bg-marine font-bold text-white hover:text-white"
          : "border-transparent text-pied hover:bg-menu-survol hover:text-white",
      )}
      href={e.href}
      onClick={onNaviguer}
    >
      {e.label}
      {compte !== undefined && <Compteur valeur={compte} />}
    </Link>
  );
}

function ContenuMenu({ onNaviguer }: { onNaviguer: () => void }) {
  const pathname = usePathname();
  const { peutVoir, nom, libelleRole } = useDroits();

  // Compteurs du menu, rafraîchis chaque minute
  const { data } = useQuery({
    queryKey: ["admin", "tableau-de-bord"],
    queryFn: () => adminAPI.tableauDeBord(),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const tdb = data?.data;
  const compteurs: Record<
    NonNullable<IEntree["compteur"]>,
    number | undefined
  > = {
    messes: tdb?.masses.to_process,
    "rendez-vous": tdb?.listens?.pending,
    commentaires: tdb?.comments.pending,
  };

  return (
    <>
      <div aria-hidden className="filet-marque h-1 shrink-0" />
      <Link
        className="flex items-center gap-3 border-b border-marine-soft p-5 no-underline hover:no-underline"
        href="/dashboard"
        onClick={onNaviguer}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Logo de la paroisse"
          className="size-12 rounded-full border-2 border-white object-cover"
          src={LOGO_PAR_DEFAUT}
        />
        <span className="flex flex-col gap-0.5">
          <span className="font-heading text-xs font-extrabold uppercase leading-[1.25] text-white">
            Saint Sauveur
            <br />
            Miséricordieux
          </span>
          <span className="text-xs text-lavande">Back-office</span>
        </span>
      </Link>

      <nav
        aria-label="Back-office"
        className="flex grow flex-col gap-0.5 overflow-y-auto py-3.5"
      >
        {GROUPES.map((g, gi) => {
          const entrees = g.entrees.filter((e) => peutVoir(e.module));

          if (!entrees.length) return null;

          return (
            <div key={gi} className="flex flex-col gap-0.5">
              {g.titre && (
                <span className="px-5 pb-1.5 pt-3.5 text-[11px] font-bold uppercase tracking-[.1em] text-menu-groupe">
                  {g.titre}
                </span>
              )}
              {entrees.map((e) => (
                <Lien
                  key={e.href}
                  compte={e.compteur ? (compteurs[e.compteur] ?? 0) : undefined}
                  e={e}
                  pathname={pathname}
                  onNaviguer={onNaviguer}
                />
              ))}
            </div>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-marine-soft px-5 py-4 text-[13px]">
        <Link
          className="flex min-w-0 flex-col gap-0.5 no-underline hover:no-underline"
          href="/dashboard/profil"
          onClick={onNaviguer}
        >
          <span className="truncate font-bold text-white">
            {nom || "Mon compte"}
          </span>
          <span className="text-lavande">{libelleRole}</span>
        </Link>
        <span className="flex gap-1">
          <Link
            aria-label="Mon profil"
            className="rounded p-2 text-lavande hover:bg-menu-survol hover:text-white"
            href="/dashboard/profil"
            onClick={onNaviguer}
          >
            <UserRound aria-hidden className="size-4" />
          </Link>
          <button
            aria-label="Se déconnecter"
            className="rounded p-2 text-lavande hover:bg-menu-survol hover:text-white"
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut aria-hidden className="size-4" />
          </button>
        </span>
      </div>
    </>
  );
}

/** Menu latéral marine de 260 px ; tiroir sur mobile. */
export function MenuLateral() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => setOuvert(false), [pathname]);

  return (
    <>
      {/* Barre mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-marine-deep px-4 lg:hidden">
        <span className="font-heading text-sm font-extrabold uppercase text-white">
          Back-office
        </span>
        <button
          aria-expanded={ouvert}
          aria-label="Ouvrir le menu"
          className="rounded p-2 text-white"
          type="button"
          onClick={() => setOuvert(true)}
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] flex-col bg-marine-deep text-pied lg:flex">
        <ContenuMenu onNaviguer={() => {}} />
      </aside>

      {ouvert && (
        <div
          aria-label="Menu du back-office"
          aria-modal="true"
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
        >
          <button
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-black/40"
            type="button"
            onClick={() => setOuvert(false)}
          />
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-marine-deep text-pied">
            <button
              aria-label="Fermer le menu"
              className="absolute right-2 top-3 z-10 rounded p-2 text-white"
              type="button"
              onClick={() => setOuvert(false)}
            >
              <X aria-hidden className="size-5" />
            </button>
            <ContenuMenu onNaviguer={() => setOuvert(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
