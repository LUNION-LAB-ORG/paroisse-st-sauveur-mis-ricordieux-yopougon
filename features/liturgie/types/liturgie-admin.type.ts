import type { ILecture } from "./liturgie.type";

/** Journée liturgique en base (écran d'administration, `GET /liturgy/days`). */
export interface IJourLiturgique {
  date: string;
  /** Intitulé affiché (surcharge comprise) */
  feast: string;
  degree: string | null;
  /** Couleur affichée (surcharge comprise) */
  color: string | null;
  is_fallback: boolean;
  imported_at: string | null;
  readings: ILecture[];
  zone?: string | null;
  feast_override?: string | null;
  color_override?: string | null;
}

export type IEtatHomelie = "draft" | "scheduled" | "published";

export interface IHomelieAdmin {
  id: number;
  date: string;
  title: string;
  content: string;
  audio_url: string | null;
  status: "draft" | "published" | "hidden";
  state?: IEtatHomelie;
  publish_at: string | null;
  notify_whatsapp?: boolean;
  priest: { id: number; fullname: string; function: string | null } | null;
}

export interface IHomelieSaisie {
  date: string;
  priest_id: number | null;
  title: string;
  content: string;
  publish_at: string | null;
  notify_whatsapp: boolean;
  status: "draft" | "published";
}

export interface IResultatImport {
  imported: string[];
  failed: string[];
}
