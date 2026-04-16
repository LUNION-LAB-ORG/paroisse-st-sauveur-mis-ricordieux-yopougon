export type IActualiteStatut = "draft" | "published";

export interface IActualite {
  id: number;
  title: string;
  author: string;
  category: string;
  image: string | null;
  new_resume: string | null;
  location: string | null;
  content: string | null;
  status: IActualiteStatut;
  views: number;
  published_at: string | null;
  created_at: string;
}

export interface IActualiteCreer {
  title: string;
  author: string;
  category: string;
  image?: File | string | null;
  new_resume?: string;
  location?: string;
  content?: string;
  status?: IActualiteStatut;
  published_at?: string;
}

export interface IActualiteModifier extends Partial<IActualiteCreer> {}

/** Alias pour compatibilite ascendante */
export type NewsItemType = IActualite;
