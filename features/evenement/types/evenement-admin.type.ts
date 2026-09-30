import type { IEvenement, IPricingTier } from "./evenement.type";

/** Événement vu du back-office (`EventResource` complet). */
export interface IEvenementAdmin extends Omit<IEvenement, "status" | "image"> {
  image: string | null;
  status: "draft" | "published" | "hidden" | null;
  registrations_open?: boolean;
  registrations_count?: number;
  attendees_count?: number;
  pricing_tiers?: IPricingTier[] | null;
}

/** Inscription à un événement (`GET /events/{id}/participants`). */
export interface IInscrit {
  id: number;
  fullname: string;
  phone: string | null;
  email: string | null;
  attendees?: number | null;
  reminder?: boolean | null;
  payment_status?: string | null;
  tier_label?: string | null;
  created_at: string;
}

export interface IEvenementSaisie {
  title: string;
  date_at: string;
  time_at: string;
  end_time: string | null;
  location_at: string;
  description: string | null;
  summary: string | null;
  category: string | null;
  audience: string | null;
  programme: { time: string; label: string }[];
  registrations_open: boolean;
  max_participants: number | null;
  status: "draft" | "published" | "hidden";
  /** Participation : envoyés seulement si modifiée */
  is_paid?: boolean;
  price?: number | null;
  pricing_tiers?: IPricingTier[] | null;
}
