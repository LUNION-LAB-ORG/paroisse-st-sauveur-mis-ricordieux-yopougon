export interface IEvenement {
  id: number;
  title: string;
  date_at: string;
  time_at: string;
  location_at: string;
  description: string | null;
  image: string;
  status: string | null;
  created_at: string;
}

/** Alias pour compatibilite ascendante */
export type Event = IEvenement;

export interface IActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
