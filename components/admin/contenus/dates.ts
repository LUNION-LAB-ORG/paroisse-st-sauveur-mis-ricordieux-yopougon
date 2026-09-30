/** Dates du back-office (fuseau de la paroisse : Africa/Abidjan = UTC). */
const FUSEAU = "Africa/Abidjan";

const deuxChiffres = (n: number) => String(n).padStart(2, "0");

/** « AAAA-MM-JJ » d'une date, dans le fuseau de la paroisse. */
export function isoJour(d: Date = new Date()): string {
  const parties = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSEAU,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

  return parties;
}

/** « HH:MM » actuelle dans le fuseau de la paroisse. */
export function heureActuelle(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: FUSEAU,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** Date « AAAA-MM-JJ » → objet Date à midi UTC (sans décalage de jour). */
export const dateDepuisIso = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`);

export function ajouterJours(iso: string, n: number): string {
  const d = dateDepuisIso(iso);

  d.setUTCDate(d.getUTCDate() + n);

  return d.toISOString().slice(0, 10);
}

/** Lundi de la semaine de `iso`. */
export function lundiDe(iso: string): string {
  const jour = dateDepuisIso(iso).getUTCDay(); // 0 = dimanche

  return ajouterJours(iso, jour === 0 ? -6 : 1 - jour);
}

const format = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", ...options });

/** « mardi 29 septembre » (« 1er » pour le premier du mois). */
export function jourLong(iso: string): string {
  const d = dateDepuisIso(iso);
  const jour = d.getUTCDate();
  const semaine = format({ weekday: "long" }).format(d);
  const mois = format({ month: "long" }).format(d);

  return `${semaine} ${jour === 1 ? "1er" : jour} ${mois}`;
}

/** « Mar » */
export const jourCourt = (iso: string) =>
  format({ weekday: "short" })
    .format(dateDepuisIso(iso))
    .replace(".", "")
    .replace(/^./, (c) => c.toUpperCase());

/** « 28/09 » */
export const jourMois = (iso: string) =>
  format({ day: "2-digit", month: "2-digit" }).format(dateDepuisIso(iso));

/** « 28/09/2026 » */
export const dateCourte = (iso: string | null | undefined) =>
  iso
    ? format({ day: "2-digit", month: "2-digit", year: "numeric" }).format(
        dateDepuisIso(iso),
      )
    : "—";

/** « sept. » */
export const moisCourt = (iso: string) =>
  format({ month: "short" }).format(dateDepuisIso(iso));

/** « Semaine du 28 septembre au 4 octobre 2026 » */
export function libelleSemaine(lundi: string): string {
  const dimanche = ajouterJours(lundi, 6);
  const d1 = dateDepuisIso(lundi);
  const d2 = dateDepuisIso(dimanche);
  const j = (d: Date) => (d.getUTCDate() === 1 ? "1er" : d.getUTCDate());
  const mois = (d: Date) => format({ month: "long" }).format(d);

  return `Semaine du ${j(d1)} ${mois(d1)} au ${j(d2)} ${mois(d2)} ${d2.getUTCFullYear()}`;
}

/** « AAAA-MM-JJ HH:MM:SS » ou ISO → valeur d'un champ datetime-local. */
export function versDateHeureLocale(v: string | null | undefined): string {
  if (!v) return "";
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/.exec(v);

  if (m) return `${m[1]}T${m[2]}`;

  return "";
}

/** Valeur datetime-local → « AAAA-MM-JJ HH:MM:00 ». */
export const depuisDateHeureLocale = (v: string) =>
  v ? `${v.replace("T", " ")}:00` : null;

/** « 06:30:00 » → « 06:30 » */
export function hhmm(t: string | null | undefined): string {
  if (!t) return "";
  // « 06:30 », « 06:30:00 » ou horodatage ISO « 2026-09-29T06:30:00Z »
  const m = /(?:^|T|\s)(\d{2}:\d{2})/.exec(t);

  return m ? m[1] : "";
}

/** Maintenant au format datetime-local (fuseau de la paroisse). */
export const maintenantLocal = () => `${isoJour()}T${heureActuelle()}`;

/** « il y a 20 min », « hier », « 26/09 » */
export function quand(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
  const ecart = (Date.now() - d.getTime()) / 1000;

  if (ecart < 60) return "à l’instant";
  if (ecart < 3600) return `il y a ${Math.round(ecart / 60)} min`;
  if (ecart < 86400) return `il y a ${Math.round(ecart / 3600)} h`;
  if (ecart < 172800) return "hier";

  return `${deuxChiffres(d.getUTCDate())}/${deuxChiffres(d.getUTCMonth() + 1)}`;
}
