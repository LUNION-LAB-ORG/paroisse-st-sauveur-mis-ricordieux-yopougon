export interface NewsItemType {
  id: number;
  title: string;
  new_resume: string;
  location: string;
  content: string;
  image: string; // URL
  status: "draft" | "published" | "archived";
  views_count: number;
  reads_count: number;
  published_at: string;
  created_at: string;
}
