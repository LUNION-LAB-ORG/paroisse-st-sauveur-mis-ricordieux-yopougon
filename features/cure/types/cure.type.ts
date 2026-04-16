export interface ICure {
  id: number;
  fullname: string;
  started_at: string;
  ended_at: string | null;
  description: string;
  created_at: string | null;
  image?: string;
}

/** Alias pour compatibilite ascendante */
export type Pastor = ICure;

export interface IActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
