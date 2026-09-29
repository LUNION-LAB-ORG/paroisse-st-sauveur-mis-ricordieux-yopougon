export type ILectureType =
  | "lecture_1"
  | "psaume"
  | "lecture_2"
  | "evangile"
  | (string & {});

export interface ILecture {
  type: ILectureType;
  ref: string | null;
  title: string | null;
  intro: string | null;
  /** HTML nettoyé côté serveur (p, br, strong, em) */
  content: string | null;
  refrain: string | null;
  refrain_ref: string | null;
  verse: string | null;
  verse_ref: string | null;
}

export interface IHomelie {
  id: number;
  title: string;
  content: string;
  audio_url: string | null;
  author: { fullname: string; function: string | null } | null;
}

export interface ILiturgie {
  date: string;
  feast: string;
  degree: string | null;
  color: string | null;
  is_fallback: boolean;
  imported_at: string | null;
  readings: ILecture[];
  homily: IHomelie | null;
}
