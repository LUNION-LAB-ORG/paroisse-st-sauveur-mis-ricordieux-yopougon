export interface Event {
  id: number;
  title: string; // titre obligatoire
  date_at: string; // ISO string
  time_at: string; // heure obligatoire
  location_at: string; // lieu obligatoire
  description: string | null; // description peut être null
  image: string;
  status: string | null;
  created_at: string;
}
