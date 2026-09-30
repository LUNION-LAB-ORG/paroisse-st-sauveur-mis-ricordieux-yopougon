/**
 * Outils partagés des écrans « Demandes, finances, équipe » du back-office
 * (dates, numéros masqués, liens WhatsApp).
 */

/** « 2026-09-30 » → « 30/09 » */
export function jourMois(iso?: string | null): string {
  if (!iso) return "—";
  const [, m, j] = iso.slice(0, 10).split("-");

  return j && m ? `${j}/${m}` : iso;
}

/** « 2026-09-28 19:10:00 » → « 28/09/2026 19:10 » */
export function dateHeure(iso?: string | null): string {
  if (!iso) return "—";
  const [d, h] = iso.replace("T", " ").split(" ");
  const [a, m, j] = d.split("-");

  return `${j}/${m}/${a}${h ? ` ${h.slice(0, 5)}` : ""}`;
}

/** Date relative courte : « il y a 2 h », « hier », sinon « 27/09 ». */
export function recue(iso?: string | null, maintenant = new Date()): string {
  if (!iso) return "—";
  const d = new Date(iso.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return jourMois(iso);
  const minutes = Math.floor((maintenant.getTime() - d.getTime()) / 60000);

  if (minutes < 1) return "à l’instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const memeJour = d.toDateString() === maintenant.toDateString();

  if (memeJour) return `il y a ${Math.floor(minutes / 60)} h`;
  const hier = new Date(maintenant);

  hier.setDate(hier.getDate() - 1);
  if (d.toDateString() === hier.toDateString()) return "hier";

  return jourMois(iso.slice(0, 10));
}

/**
 * Masque un numéro comme la maquette : « +225 07 •• •• •• 12 ».
 * Garde l'indicatif, les deux premiers et les deux derniers chiffres.
 */
export function numeroMasque(tel?: string | null): string {
  if (!tel) return "—";
  const chiffres = tel.replace(/[^\d]/g, "");

  if (chiffres.length < 6) return "•• ••";
  const indicatif = chiffres.startsWith("225") && chiffres.length > 10;
  const local = indicatif ? chiffres.slice(3) : chiffres;
  const debut = local.slice(0, 2);
  const fin = local.slice(-2);
  const milieu = Math.max(1, Math.round((local.length - 4) / 2));

  return `${indicatif ? "+225 " : tel.startsWith("+") ? "+" : ""}${debut} ${Array(
    milieu,
  )
    .fill("••")
    .join(" ")} ${fin}`;
}

/** Numéro de téléphone lisible : « +225 07 00 00 00 00 ». */
export function numeroLisible(tel?: string | null): string {
  if (!tel) return "—";
  const chiffres = tel.replace(/[^\d]/g, "");

  if (chiffres.startsWith("225") && chiffres.length === 13)
    return `+225 ${chiffres
      .slice(3)
      .replace(/(\d{2})(?=\d)/g, "$1 ")
      .trim()}`;

  return tel;
}

/** Lien WhatsApp direct vers un numéro, message prérempli (sans API). */
export function lienWhatsapp(tel: string, texte: string): string {
  return `https://wa.me/${tel.replace(/[^\d]/g, "")}?text=${encodeURIComponent(texte)}`;
}

export const AIDE_WHATSAPP =
  "Disponible dès que WhatsApp Business sera configuré.";
