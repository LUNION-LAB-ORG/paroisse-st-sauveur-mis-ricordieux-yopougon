import type { IContenuStatut } from "@/features/pretre/types/pretre.type";

export type IPublicationType = "photo" | "video" | "text";

export interface IPublication {
  id: number;
  slug: string;
  type: IPublicationType;
  format: string;
  category: string | null;
  title: string;
  lead: string | null;
  /** Paragraphes séparés par une ligne vide */
  body: string | null;
  quote: string | null;
  cover: string | null;
  gallery: string[];
  video_url: string | null;
  youtube_id: string | null;
  video_duration: string | null;
  author_label: string;
  is_featured: boolean;
  likes_count: number;
  comments_count: number;
  photos_count: number;
  reading_minutes: number;
  published_at: string | null;
  status: IContenuStatut;
  sort_order: number;
}

export interface ICommentaire {
  id: number;
  author: string;
  initial: string;
  content: string;
  reply: string | null;
  replied_at: string | null;
  likes_count: number;
  created_at: string;
  status: "pending" | "published" | "rejected";
}

export interface IPublicationsPage {
  data: IPublication[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
