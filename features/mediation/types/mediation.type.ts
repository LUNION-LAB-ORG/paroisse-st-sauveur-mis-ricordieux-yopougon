export type IMediationStatus = "draft" | "published";

export interface IMediation {
  id: number;
  title: string;
  date_at: string;
  author: string;
  category: string;
  status: IMediationStatus;
  views: number | null;
  created_at: string;
}

export interface IMediationCreer {
  title: string;
  date_at: string;
  author: string;
  category: string;
  status?: IMediationStatus;
}

export interface IMediationModifier extends Partial<IMediationCreer> {}
