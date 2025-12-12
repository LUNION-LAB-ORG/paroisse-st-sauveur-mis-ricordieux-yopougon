export interface NewsItem {
  id: number;
  title: string;
  author: string | null;
  category: string | null;
  status: string | null;
  views: number;
  published_at: string | null; // format ISO: "2024-03-13T00:00:00.000000Z"
  created_at: string;          // format: "2025-12-12 09:13:46"
}


