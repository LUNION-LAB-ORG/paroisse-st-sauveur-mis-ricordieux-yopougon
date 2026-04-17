export interface IPricingTier {
  label: string;
  amount: number;
  description?: string;
}

export interface IEvenement {
  id: number;
  title: string;
  date_at: string;
  time_at: string;
  location_at: string;
  description: string | null;
  image: string;
  status: string | null;
  is_paid: boolean;
  price: number | null;
  pricing_tiers?: IPricingTier[] | null;
  max_participants: number | null;
  registration_deadline: string | null;
  participants_count: number | null;
  spots_remaining: number | null;
  created_at: string;
}

export interface IInscriptionResponse {
  type: "free" | "paid" | "paid_dev";
  message: string;
  wave_launch_url?: string;
  checkout_id?: string;
  amount?: string;
  expires_at?: string | null;
  participant_id?: number;
  participant?: unknown;
}

/** Alias pour compatibilite ascendante */
export type Event = IEvenement;

export interface IActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
