export interface IService {
  id: number;
  title: string;
  description: string;
  image: string | null;
  content: string | null;
  leader: string | null;
  schedule: string | null;
  /** Champs de la refonte (fiche « Mouvements et groupes » de l'accueil) */
  category: string | null;
  audience: string | null;
  location: string | null;
  whatsapp: string | null;
  status: "draft" | "published" | "hidden";
  sort_order: number;
  created_at: string;
}

export interface IServiceCreer {
  title: string;
  description: string;
  image?: File | null;
  content?: string;
  leader?: string;
  schedule?: string;
  category?: string;
  audience?: string;
  location?: string;
  whatsapp?: string;
  status?: "draft" | "published" | "hidden";
  sort_order?: number;
}

export interface IServiceModifier extends Partial<IServiceCreer> {}
