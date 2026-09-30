import type { IEvenementAdmin } from "@/features/evenement/types/evenement-admin.type";

/** « AAAA-MM-JJ » de l'événement (date_at peut être une date ou un horodatage). */
export const dateEvenement = (e: Pick<IEvenementAdmin, "date_at">) =>
  /^\d{4}-\d{2}-\d{2}/.test(e.date_at ?? "") ? e.date_at.slice(0, 10) : "";

export { hhmm as heure } from "@/components/admin/contenus/dates";

const montant = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(n).replace(/ | /g, " ")} F`;

/** Valeur initiale du champ « Participation ». */
export function participationInitiale(e: IEvenementAdmin | null): string {
  if (!e || !e.is_paid) return e ? "Libre" : "";
  const tarifs = e.pricing_tiers ?? [];

  if (tarifs.length > 1)
    return tarifs.map((t) => `${t.label} ${montant(t.amount)}`).join(", ");
  const prix = tarifs[0]?.amount ?? e.price;

  return prix ? String(Math.round(Number(prix))) : "";
}

/** « +225 07 •• •• •• 12 » : numéro WhatsApp masqué (liste des inscrits). */
export function telephoneMasque(tel: string | null | undefined): string {
  if (!tel) return "—";
  const chiffres = tel.replace(/[^\d+]/g, "");

  if (chiffres.length < 6) return tel;
  const fin = chiffres.slice(-2);
  const avecIndicatif =
    chiffres.startsWith("+225") || chiffres.startsWith("225");
  const local = chiffres.replace(/^\+?225/, "");
  const debut = avecIndicatif ? `+225 ${local.slice(0, 2)}` : local.slice(0, 2);

  return `${debut} •• •• •• ${fin}`;
}
