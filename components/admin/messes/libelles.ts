import type { TonPastille } from "@/components/admin/ui/kit";
import type {
  IDemandeMesseAdmin,
  IFiltreMesses,
  IFormuleMesse,
} from "@/features/messe/types/messe-admin.type";

import { heureCourte } from "@/lib/charte";
import { jourMois } from "@/components/admin/demandes/outils";

export const TYPES_INTENTION = [
  "Action de grâce",
  "Repos de l’âme",
  "Guérison",
  "Protection",
  "Bénédiction",
  "Autre intention",
] as const;

export const FORMULES: Record<IFormuleMesse, { label: string; n: number }> = {
  single: { label: "Une messe", n: 1 },
  triduum: { label: "Triduum", n: 3 },
  novena: { label: "Neuvaine", n: 9 },
};

export const MOYENS_PAIEMENT: Record<string, string> = {
  wave: "Wave",
  orange: "Orange Money",
  mtn: "MTN MoMo",
  moov: "Moov Money",
  card: "Carte bancaire",
  secretariat: "Au secrétariat",
  cash: "Espèces",
};

/**
 * Filtres de la maquette. « À traiter » n'apparaît que lorsqu'il est demandé
 * par l'adresse (`?filtre=to_process`, lien du tableau de bord).
 */
export type IFiltreEcran = IFiltreMesses | "today";

export const FILTRES_MESSES: { valeur: IFiltreEcran; label: string }[] = [
  { valeur: "all", label: "Toutes" },
  { valeur: "to_process", label: "À traiter" },
  { valeur: "to_pay", label: "À régler" },
  { valeur: "paid", label: "Payées" },
  { valeur: "today", label: "Aujourd’hui" },
];

export function statutPaiement(d: IDemandeMesseAdmin): {
  label: string;
  ton: TonPastille;
} {
  if (d.request_status === "canceled")
    return { label: "Annulée", ton: "neutre" };
  switch (d.payment_status) {
    case "succeeded":
      return { label: "Payée", ton: "succes" };
    case "to_pay":
      return { label: "À régler", ton: "attention" };
    case "failed":
      return { label: "Échoué", ton: "danger" };
    case "pending":
      return { label: "En attente", ton: "info" };
    default:
      return { label: "—", ton: "neutre" };
  }
}

export const libelleDemande = (d: IDemandeMesseAdmin) =>
  d.request_status === "accepted"
    ? "Validée"
    : d.request_status === "canceled"
      ? "Annulée"
      : "À traiter";

export const numeroDemande = (d: IDemandeMesseAdmin) =>
  d.number ?? `N° ${d.id}`;

export const intentionDe = (d: IDemandeMesseAdmin) =>
  d.intention_type || d.type || "—";

export const pourQui = (d: IDemandeMesseAdmin) =>
  d.is_confidential ? "Confidentiel" : d.for_whom || "—";

/** « 30/09 · 18:30 » (+ « +8 » pour une neuvaine) */
export function premiereMesse(d: IDemandeMesseAdmin): string {
  const s = d.schedules?.[0];
  const date = s?.date ?? d.date_at;
  const heure = heureCourte(s?.time ?? d.time_at);

  if (!date) return "—";
  const suite =
    (d.schedules?.length ?? 0) > 1 ? ` +${d.schedules!.length - 1}` : "";

  return `${jourMois(date)}${heure ? ` · ${heure}` : ""}${suite}`;
}
