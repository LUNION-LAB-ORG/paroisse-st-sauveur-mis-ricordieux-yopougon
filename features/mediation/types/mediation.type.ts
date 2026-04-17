export type IMediationStatus = "draft" | "published" | "archived";

export interface IMediation {
  id: number;
  title: string;
  date_at: string;
  author: string;
  category: string;
  image: string | null;
  content: string | null;
  status: IMediationStatus;
  views: number | null;
  created_at: string;
}

export interface IMediationCreer {
  title: string;
  date_at: string;
  author: string;
  category: string;
  content?: string;
  image?: File | null;
  mediation_status?: IMediationStatus;
}

export interface IMediationModifier extends Partial<IMediationCreer> {}
