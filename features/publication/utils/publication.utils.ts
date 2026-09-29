import type { IPublication } from "../types/publication.type";

export const formatDatePublication = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Abidjan",
      }).format(new Date(iso))
    : "";

/** « il y a 2 h », « il y a 3 jours » */
export function ilYa(iso: string): string {
  const secondes = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
  const paliers: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unite, s] of paliers) {
    if (Math.abs(secondes) >= s)
      return rtf.format(Math.round(secondes / s), unite);
  }

  return "à l’instant";
}

/** Libellé du média : « 12 photos », « Vidéo · 4:32 » */
export function libelleMedia(p: IPublication): string {
  if (p.type === "video")
    return p.video_duration ? `Vidéo · ${p.video_duration}` : "Vidéo";
  if (p.type === "photo")
    return p.photos_count > 0
      ? `${p.photos_count} photo${p.photos_count > 1 ? "s" : ""}`
      : "Album photo";

  return "";
}

/** Le texte de la publication, découpé en paragraphes. */
export const paragraphes = (body: string | null) =>
  (body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** La publication parle-t-elle du chantier ? (bouton « Soutenir la construction ») */
export const concerneLeChantier = (p: IPublication) =>
  /chantier|nouvelle église|construction/i.test(`${p.category} ${p.title}`);
