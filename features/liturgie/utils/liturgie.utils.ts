import type { ILecture, ILiturgie } from "../types/liturgie.type";

export interface ILecturesDuJour {
  premiere: ILecture | null;
  /** Lecture alternative (« ou bien ») : deuxième `lecture_1` éventuelle */
  premiereAlternative: ILecture | null;
  psaume: ILecture | null;
  deuxieme: ILecture | null;
  evangile: ILecture | null;
}

export function lecturesDuJour(liturgie: ILiturgie | null): ILecturesDuJour {
  const lectures = liturgie?.readings ?? [];
  const premieres = lectures.filter((l) => l.type === "lecture_1");

  return {
    premiere: premieres[0] ?? null,
    premiereAlternative: premieres[1] ?? null,
    psaume: lectures.find((l) => l.type === "psaume") ?? null,
    deuxieme: lectures.find((l) => l.type === "lecture_2") ?? null,
    evangile: lectures.find((l) => l.type === "evangile") ?? null,
  };
}

/** Retire les balises (texte brut pour les titres, refrains, partage). */
export function texteBrut(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Référence courte pour les onglets : « Dn 7, 9-10.13-14 » → « Dn 7 » ; « Ps 137 (138), 1-2a » → « Ps 137 » */
export function referenceCourte(ref: string | null | undefined): string {
  const r = (ref ?? "").replace(/ /g, " ").trim();

  return r.split(/[,(]/)[0].trim();
}

/** Titre sans guillemets français décoratifs pour l'affichage en grand */
export function titreLecture(titre: string | null | undefined): string {
  return texteBrut(titre).replace(/ /g, " ");
}

/**
 * Seconde barrière après le nettoyage serveur : ne garde que p, br, strong, em,
 * sans attributs, avant un rendu en HTML.
 */
export function nettoyerHtml(html: string | null | undefined): string {
  const autorisees = new Set([
    "<p>",
    "</p>",
    "<br>",
    "<strong>",
    "</strong>",
    "<em>",
    "</em>",
  ]);

  return (html ?? "")
    .split(/(<[^<>]*>)/g)
    .map((morceau) => {
      if (!morceau.startsWith("<") || !morceau.endsWith(">")) {
        // Texte : un chevron isolé reste du texte
        return morceau.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      // Balise réduite à sa forme nue (<p class="x"> → <p>, <br /> → <br>), puis liste blanche
      const nue = morceau.match(
        /^<\s*(\/?)\s*([a-z]+)(?:\s[^>]*)?\s*\/?\s*>$/i,
      );
      const forme = nue ? `<${nue[1]}${nue[2].toLowerCase()}>` : "";

      return autorisees.has(forme) ? forme : "";
    })
    .join("");
}
