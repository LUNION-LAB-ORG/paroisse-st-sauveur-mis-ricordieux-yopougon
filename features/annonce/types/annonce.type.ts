import type { IContenuStatut } from "@/features/pretre/types/pretre.type";

export interface IAnnonce {
  id: number;
  category: string;
  title: string;
  content: string;
  contact: string | null;
  is_featured: boolean;
  visible_from: string | null;
  visible_until: string | null;
  status: IContenuStatut;
  sort_order: number;
  created_at: string;
}
