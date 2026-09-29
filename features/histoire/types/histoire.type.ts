import type { IContenuStatut } from "@/features/pretre/types/pretre.type";

export interface IJalon {
  id: number;
  year: string;
  title: string;
  status: IContenuStatut;
  sort_order: number;
}
