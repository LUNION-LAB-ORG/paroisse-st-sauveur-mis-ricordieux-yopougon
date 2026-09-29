/** Gabarit horizontal commun du site public : 120 px de marge à 1440 px, 16 px sur mobile. */
export const CONTENEUR =
  "mx-auto w-full max-w-[1440px] px-4 md:px-10 maquette:px-[120px]";

/** Logo officiel de la paroisse (charte graphique). */
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

/** « 18:30:00 » ou « 2026-09-29T18:30:00Z » → « 18:30 » */
export const heureCourte = (h: string | null | undefined) =>
  (h ?? "").match(/\d{2}:\d{2}/)?.[0] ?? "";

/** Jour et mois abrégés pour les pastilles de date (« 12 », « oct. ») */
export function pastilleDate(iso: string): { jour: string; mois: string } {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);

  return {
    jour: String(d.getUTCDate()),
    mois: new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      timeZone: "UTC",
    }).format(d),
  };
}

/** « 12 octobre » */
export function jourMoisLong(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

/** Carte Google Maps intégrée (sans clé) pour une adresse. */
export const carteGoogle = (adresse: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`;

/** Adresse publique du site (liens absolus, données structurées, partage). */
export const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paroisse-st-sauveur-mis-ricordieux.vercel.app";

/** Lien WhatsApp direct vers un numéro (« +225 07 00 00 00 00 » → wa.me/2250700000000). */
export function lienWhatsappNumero(numero: string, message?: string): string {
  const chiffres = numero.replace(/[^\d]/g, "");

  return `https://wa.me/${chiffres}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Lien d'appel téléphonique. */
export const lienTelephone = (numero: string) =>
  `tel:${numero.replace(/[^\d+]/g, "")}`;

/** AAAA-MM-JJ + n jours → AAAA-MM-JJ (calcul en UTC, sans décalage horaire). */
export function ajouterJours(iso: string, n: number): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);

  d.setUTCDate(d.getUTCDate() + n);

  return d.toISOString().slice(0, 10);
}

/** Lundi de la semaine d'une date (AAAA-MM-JJ). */
export function lundiDe(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);

  return ajouterJours(iso, -((d.getUTCDay() + 6) % 7));
}

/** Une date AAAA-MM-JJ valide ? */
export const estDateIso = (v: string | undefined | null): v is string =>
  !!v &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()) &&
  new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;

/** Pastille de couleur liturgique (valeurs AELF : vert, violet, blanc, rouge, rose, noir, or). */
export function teinteLiturgique(couleur: string | null | undefined): string {
  const c = (couleur ?? "").toLowerCase();

  if (c.includes("vert")) return "#2E7D4F";
  if (c.includes("violet")) return "#5B2A86";
  if (c.includes("rose")) return "#D98BA8";
  if (c.includes("rouge")) return "#B71C3A";
  if (c.includes("noir")) return "#1B1B22";
  if (c.includes("or") || c.includes("jaune")) return "#C9A227";

  return "#FFFFFF";
}

/** Découpe un texte long en paragraphes (séparés par une ligne vide). */
export const enParagraphes = (texte: string | null | undefined) =>
  (texte ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** « 12 octobre 2026 » à partir d'une date ou d'un horodatage ISO (jour civil, sans décalage). */
export function dateCourte(iso: string | null | undefined): string {
  if (!iso) return "";
  const jour = iso.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(jour)) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${jour}T00:00:00Z`));
}
