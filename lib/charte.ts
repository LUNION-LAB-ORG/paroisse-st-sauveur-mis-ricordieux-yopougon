/** Gabarit horizontal commun du site public : 120 px de marge à 1440 px, 16 px sur mobile. */
export const CONTENEUR =
  "mx-auto w-full max-w-[1440px] px-4 md:px-10 maquette:px-[120px]";

/** Logo par défaut si aucun logo n'est téléversé dans les paramètres. */
export const LOGO_PAR_DEFAUT = "/logo-paroisse.png";

/** Fuseau de la paroisse (Abidjan, UTC+0 sans heure d'été). */
export const FUSEAU_PAROISSE = "Africa/Abidjan";

/** Date du jour au format AAAA-MM-JJ dans le fuseau de la paroisse. */
export function dateDuJour(maintenant: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSEAU_PAROISSE }).format(
    maintenant,
  );
}

/** « Mardi 29 septembre 2026 » */
export function dateLongue(iso: string): string {
  const texte = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** « Mardi 29 septembre » (1er pour le premier jour du mois) */
export function dateSansAnnee(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const jour = d.getUTCDate() === 1 ? "1er" : String(d.getUTCDate());
  const nomJour = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    timeZone: "UTC",
  }).format(d);
  const mois = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    timeZone: "UTC",
  }).format(d);

  return `${nomJour.charAt(0).toUpperCase()}${nomJour.slice(1)} ${jour} ${mois}`;
}

/** 25000 → « 25 000 » (espace fine insécable, usage français) */
export function formatMontant(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
    .format(n)
    .replace(/\s/g, " ");
}

/** Lien de partage WhatsApp sans API (spec 4.3). */
export function lienPartageWhatsapp(texte: string): string {
  return `https://wa.me/?text=${encodeURIComponent(texte)}`;
}
