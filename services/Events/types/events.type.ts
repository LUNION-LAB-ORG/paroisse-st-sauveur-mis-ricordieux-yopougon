export interface Event {
  id: number;
  title: string;
  description: string;
  location: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  image: string;
  status: string | null;
  created_at: string;
}
