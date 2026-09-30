"use client";

import type { IEtatHomelie } from "@/features/admin/types/admin.type";
import type { ILiturgie } from "@/features/liturgie/types/liturgie.type";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  BoutonAdmin,
  Carte,
  CaseAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { adminAPI } from "@/features/admin/apis/admin.api";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { apiClient } from "@/lib/api.client";
import { dateDuJour, dateLongue, formatMontant } from "@/lib/charte";
import { cn } from "@/lib/utils";

const NOUVEAUX_CONTENUS = [
  { label: "Homélie du jour", href: "/dashboard/liturgie", module: "liturgie" },
  {
    label: "Annonce",
    href: "/dashboard/annonces?nouvelle=1",
    module: "annonces",
  },
  {
    label: "Événement",
    href: "/dashboard/evenements/new",
    module: "evenements",
  },
  {
    label: "Publication (photo, vidéo, texte)",
    href: "/dashboard/publications/nouvelle",
    module: "publications",
  },
  {
    label: "Mouvement",
    href: "/dashboard/mouvements?nouveau=1",
    module: "mouvements",
  },
] as const;

const ETAT_HOMELIE: Record<IEtatHomelie, { libelle: string; classe: string }> =
  {
    published: { libelle: "Publiée", classe: "text-succes" },
    scheduled: { libelle: "Programmée", classe: "text-marine" },
    draft: { libelle: "Brouillon", classe: "text-attention" },
    missing: { libelle: "À rédiger", classe: "text-attention" },
  };

/** « il y a 5 min », « hier à 18:30 » */
function quand(iso: string): string {
  const d = new Date(iso);
  const minutes = Math.round((Date.now() - d.getTime()) / 60000);

  if (minutes < 1) return "à l’instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (minutes < 60 * 24) return `il y a ${Math.round(minutes / 60)} h`;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Abidjan",
  }).format(d);
}

/** Tâches cochées aujourd'hui (mémoire locale du poste, remise à zéro chaque jour). */
function useTachesFaites() {
  const cle = `ssm-taches-${dateDuJour()}`;
  const [faites, setFaites] = useState<string[]>([]);

  useEffect(() => {
    try {
      setFaites(JSON.parse(window.localStorage.getItem(cle) ?? "[]"));
    } catch {
      setFaites([]);
    }
  }, [cle]);

  const basculer = (k: string) =>
    setFaites((f) => {
      const suivant = f.includes(k) ? f.filter((x) => x !== k) : [...f, k];

      try {
        window.localStorage.setItem(cle, JSON.stringify(suivant));
      } catch {
        /* stockage indisponible */
      }

      return suivant;
    });

  return { faites, basculer };
}

function Indicateur({
  href,
  libelle,
  valeur,
  detail,
  detailRouge,
}: {
  href: string;
  libelle: string;
  valeur: React.ReactNode;
  detail: React.ReactNode;
  detailRouge?: boolean;
}) {
  return (
    <Link
      className="flex flex-col gap-1.5 rounded-admin border border-bord-admin bg-white p-5 text-encre hover:border-champ hover:text-encre hover:no-underline"
      href={href}
    >
      <span className="text-sm text-gris">{libelle}</span>
      <span className="font-heading text-[32px] font-extrabold leading-tight text-marine">
        {valeur}
      </span>
      <span
        className={cn(
          "text-[13px]",
          detailRouge ? "font-bold text-rouge" : "text-gris",
        )}
      >
        {detail}
      </span>
    </Link>
  );
}

export default function TableauDeBord() {
  const { peutVoir } = useDroits();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { faites, basculer } = useTachesFaites();
  const aujourdhui = dateDuJour();

  const tdb = useQuery({
    queryKey: ["admin", "tableau-de-bord"],
    queryFn: () => adminAPI.tableauDeBord(),
    refetchInterval: 60_000,
  });
  const activites = useQuery({
    queryKey: ["admin", "activites"],
    queryFn: () => adminAPI.activites(6),
    refetchInterval: 60_000,
  });
  const liturgie = useQuery({
    queryKey: ["liturgie", aujourdhui],
    queryFn: (): Promise<{ data: ILiturgie }> =>
      apiClient.request({
        endpoint: "/liturgy",
        method: "GET",
        searchParams: { date: aujourdhui },
        service: "public",
      }),
    staleTime: 10 * 60_000,
  });

  useEffect(() => {
    if (!menuOuvert) return;
    const fermer = (e: MouseEvent) =>
      !menuRef.current?.contains(e.target as Node) && setMenuOuvert(false);
    const echap = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOuvert(false);

    document.addEventListener("mousedown", fermer);
    document.addEventListener("keydown", echap);

    return () => {
      document.removeEventListener("mousedown", fermer);
      document.removeEventListener("keydown", echap);
    };
  }, [menuOuvert]);

  const d = tdb.data?.data;
  const taches = d?.tasks ?? [];
  const restantes = taches.filter((t) => !faites.includes(t.key)).length;
  const nouveaux = NOUVEAUX_CONTENUS.filter((n) => peutVoir(n.module));
  const lit = liturgie.data?.data;

  return (
    <>
      <EnTeteAdmin
        actions={
          <>
            <BoutonAdmin cible="_blank" href="/" variante="neutre">
              Voir le site
            </BoutonAdmin>
            {nouveaux.length > 0 && (
              <div ref={menuRef} className="relative">
                <BoutonAdmin
                  aria-label="Créer un nouveau contenu"
                  variante="primaire"
                  onPress={() => setMenuOuvert((v) => !v)}
                >
                  + Nouveau contenu
                </BoutonAdmin>
                {menuOuvert && (
                  <div
                    className="absolute right-0 top-[52px] z-10 flex w-[240px] flex-col rounded-admin border border-bord-admin bg-white py-1.5 shadow-[0_12px_30px_rgba(20,22,60,.12)]"
                    role="menu"
                  >
                    {nouveaux.map((n) => (
                      <Link
                        key={n.href}
                        className="px-4 py-2.5 text-sm text-encre hover:bg-entete-admin hover:text-encre hover:no-underline"
                        href={n.href}
                        role="menuitem"
                      >
                        {n.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        }
        sousTitre={`${dateLongue(aujourdhui)}${lit?.feast ? ` · ${lit.feast}` : ""}`}
        titre="Tableau de bord"
      />

      <ContenuAdmin>
        {tdb.isError && (
          <ErreurChargement
            message="Le tableau de bord n’a pas pu être chargé."
            onReessayer={() => tdb.refetch()}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Indicateur
            detail={d ? `${d.masses.to_pay} à régler au secrétariat` : "…"}
            detailRouge={!!d?.masses.to_pay}
            href="/dashboard/messes?filtre=to_process"
            libelle="Demandes de messe à traiter"
            valeur={d?.masses.to_process ?? "—"}
          />
          <Indicateur
            detail={
              d
                ? `${d.donations_week.count} donateur${d.donations_week.count > 1 ? "s" : ""}`
                : "…"
            }
            href="/dashboard/dons"
            libelle="Dons cette semaine"
            valeur={
              d ? (
                <>
                  {formatMontant(d.donations_week.total)}{" "}
                  <span className="text-base">FCFA</span>
                </>
              ) : (
                "—"
              )
            }
          />
          <Indicateur
            detail={
              d
                ? `sur ${d.comments.publications} publication${d.comments.publications > 1 ? "s" : ""}`
                : "…"
            }
            href="/dashboard/commentaires"
            libelle="Commentaires à modérer"
            valeur={d?.comments.pending ?? "—"}
          />
          <Indicateur
            detail={
              d?.next_event
                ? `${d.next_event.attendees} personne${d.next_event.attendees > 1 ? "s" : ""}${d.next_event.max_participants ? ` · jauge : ${d.next_event.max_participants}` : ""}`
                : d
                  ? "Aucun événement à venir"
                  : "…"
            }
            href="/dashboard/evenements"
            libelle={
              d?.next_event
                ? `Inscrits — ${d.next_event.title}`
                : "Prochain événement"
            }
            valeur={d?.next_event ? d.next_event.registrations : "—"}
          />
        </div>

        <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-[22px]">
            <Carte
              action={
                <span className="text-[13px] text-gris">
                  {restantes} tâche(s)
                </span>
              }
              titre="À traiter aujourd’hui"
            >
              {taches.length === 0 ? (
                <p className="m-0 px-[22px] py-6 text-sm text-gris">
                  {tdb.isLoading
                    ? "Chargement…"
                    : "Rien à traiter pour le moment."}
                </p>
              ) : (
                <ul className="m-0 list-none p-0">
                  {taches.map((t) => {
                    const fait = faites.includes(t.key);

                    return (
                      <li
                        key={t.key}
                        className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-b border-ligne-admin px-[22px] py-3.5 last:border-b-0"
                      >
                        <CaseAdmin
                          valeur={fait}
                          onChange={() => basculer(t.key)}
                        >
                          <span className="sr-only">Marquer comme fait</span>
                        </CaseAdmin>
                        <span
                          className={cn(
                            "text-[15px]",
                            fait && "text-gris line-through",
                          )}
                        >
                          {t.label}
                        </span>
                        <Link
                          className="text-sm font-bold text-rouge hover:text-rouge-hover"
                          href={t.href}
                        >
                          Traiter
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Carte>

            <Carte
              action={
                <Link
                  className="font-bold text-rouge hover:text-rouge-hover"
                  href="/dashboard/messes"
                >
                  Toutes les demandes
                </Link>
              }
              titre="Intentions des messes d’aujourd’hui"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr className="text-left text-[13px] text-gris">
                      <th className="px-[22px] py-3 font-semibold">Messe</th>
                      <th className="px-3 py-3 font-semibold">Intentions</th>
                      <th className="px-3 py-3 font-semibold">
                        Dont confidentielles
                      </th>
                      <th className="px-[22px] py-3 text-right font-semibold">
                        Liste du célébrant
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(d?.today_masses ?? []).length === 0 ? (
                      <tr className="border-t border-ligne-admin">
                        <td
                          className="px-[22px] py-5 text-sm text-gris"
                          colSpan={4}
                        >
                          {tdb.isLoading
                            ? "Chargement…"
                            : "Aucune intention pour les messes d’aujourd’hui."}
                        </td>
                      </tr>
                    ) : (
                      d!.today_masses.map((m) => (
                        <tr
                          key={m.time_slot_id}
                          className="border-t border-ligne-admin"
                        >
                          <td className="px-[22px] py-3.5 font-bold">
                            {m.time} · {m.label}
                          </td>
                          <td className="px-3 py-3.5">{m.intentions}</td>
                          <td className="px-3 py-3.5">{m.confidential}</td>
                          <td className="px-[22px] py-3.5 text-right">
                            <BoutonAdmin
                              cible="_blank"
                              className="min-h-9 px-3.5 py-2"
                              href={`/dashboard/messes/celebrant?date=${aujourdhui}`}
                              variante="contour"
                            >
                              Imprimer
                            </BoutonAdmin>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Carte>
          </div>

          <div className="flex flex-col gap-[22px]">
            <Carte corpsClassName="flex flex-col gap-3 px-[22px] py-5">
              <span className="font-heading text-base font-extrabold text-marine">
                Parole du jour
              </span>
              <div className="flex justify-between gap-3 text-sm">
                <span>Textes AELF (J à J+7)</span>
                <span
                  className={cn(
                    "font-bold",
                    (d?.liturgy.imported_days ?? 0) >= 7
                      ? "text-succes"
                      : "text-attention",
                  )}
                >
                  {d
                    ? (d.liturgy.imported_days ?? 0) >= 7
                      ? `Importés${d.liturgy.last_import_at ? ` à ${d.liturgy.last_import_at.slice(11, 16)}` : ""}`
                      : `${d.liturgy.imported_days} jour(s) sur 7`
                    : "…"}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span>Homélie d’aujourd’hui</span>
                <span
                  className={cn(
                    "font-bold",
                    d && ETAT_HOMELIE[d.liturgy.homily_today]?.classe,
                  )}
                >
                  {d ? ETAT_HOMELIE[d.liturgy.homily_today]?.libelle : "…"}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span>Homélie de demain</span>
                <span
                  className={cn(
                    "font-bold",
                    d && ETAT_HOMELIE[d.liturgy.homily_tomorrow]?.classe,
                  )}
                >
                  {d ? ETAT_HOMELIE[d.liturgy.homily_tomorrow]?.libelle : "…"}
                </span>
              </div>
              <Link
                className="text-sm font-bold text-rouge hover:text-rouge-hover"
                href="/dashboard/liturgie"
              >
                Gérer la Parole du jour
              </Link>
            </Carte>

            <Carte corpsClassName="flex flex-col gap-3 px-[22px] py-5">
              <span className="font-heading text-base font-extrabold text-marine">
                Collecte nouvelle église
              </span>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-heading text-[28px] font-extrabold text-marine">
                  {d ? `${d.church_project.progress} %` : "—"}
                </span>
                {d && (
                  <span className="text-[13px] text-gris">
                    {formatMontant(d.church_project.collected_amount)} /{" "}
                    {d.church_project.goal_amount
                      ? formatMontant(d.church_project.goal_amount)
                      : "—"}{" "}
                    FCFA
                  </span>
                )}
              </div>
              <div
                aria-label="Avancement de la collecte"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={d?.church_project.progress ?? 0}
                className="h-1.5 rounded-[3px] bg-[#E9E6DE]"
                role="progressbar"
              >
                <div
                  className="h-full rounded-[3px] bg-marine"
                  style={{
                    width: `${Math.min(100, d?.church_project.progress ?? 0)}%`,
                  }}
                />
              </div>
              {d?.church_project.current_phase && (
                <span className="text-[13px] text-gris">
                  Phase en cours : {d.church_project.current_phase}
                </span>
              )}
              <Link
                className="text-sm font-bold text-rouge hover:text-rouge-hover"
                href="/dashboard/dons"
              >
                Mettre à jour l’avancement
              </Link>
            </Carte>

            <Carte corpsClassName="flex flex-col gap-3 px-[22px] py-5">
              <span className="font-heading text-base font-extrabold text-marine">
                Dernières activités
              </span>
              {(activites.data?.data ?? []).length === 0 ? (
                <span className="text-sm text-gris">
                  {activites.isLoading
                    ? "Chargement…"
                    : "Aucune activité récente."}
                </span>
              ) : (
                activites.data!.data.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col gap-0.5 border-t border-ligne-admin pt-2.5"
                  >
                    <span className="text-sm">{a.description}</span>
                    <span className="text-xs text-gris">
                      {quand(a.created_at)}
                      {a.user && ` · ${a.user.name}`}
                    </span>
                  </div>
                ))
              )}
            </Carte>
          </div>
        </div>
      </ContenuAdmin>
    </>
  );
}
