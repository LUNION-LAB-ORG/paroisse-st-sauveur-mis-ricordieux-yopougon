import type { IContenuStatut } from "@/features/pretre/types/pretre.type";

export interface IConseil {
  id: number;
  name: string;
  role: string | null;
  leader_title: string | null;
  leader_name: string | null;
  status: IContenuStatut;
  sort_order: number;
}
