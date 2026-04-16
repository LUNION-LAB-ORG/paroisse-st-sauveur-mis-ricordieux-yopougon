export type IActualiteStatut = "draft" | "published" | "archived";

export interface IActualite {
  id: number;
  title: string;
  new_resume: string;
  location: string;
  content: string;
  image: string;
  new_status: IActualiteStatut;
  status?: IActualiteStatut;
  views_count: number;
  reads_count: number;
  published_at: string;
  created_at: string;
}

export interface IActualiteCreer {
  title: string;
  image?: File | string;
  new_resume: string;
  location: string;
  content: string;
  new_status?: IActualiteStatut;
  published_at?: string;
}

export interface IActualiteModifier extends Partial<IActualiteCreer> {}

/** Alias pour compatibilite ascendante */
export type NewsItemType = IActualite;
