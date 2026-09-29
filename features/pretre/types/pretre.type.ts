export type IContenuStatut = "draft" | "published" | "hidden";

export interface IPretre {
  id: number;
  fullname: string;
  function: string;
  missions: string | null;
  biography: string | null;
  ordination_year: number | null;
  photo: string | null;
  status: IContenuStatut;
  sort_order: number;
}
