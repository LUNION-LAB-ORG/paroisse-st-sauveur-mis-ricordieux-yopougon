export interface IProgrammation {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  date_at: string;
  started_at: string;
  ended_at: string | null;
  description: string;
  location: string | null;
  is_published: boolean;
  created_at: string;
}

export interface IProgrammationCreer {
  name: string;
  image?: File | null;
  category?: string;
  date_at: string;
  started_at: string;
  ended_at?: string;
  description: string;
  location?: string;
  is_published?: boolean;
}

export interface IProgrammationModifier extends Partial<IProgrammationCreer> {}

export const PROGRAMMATION_CATEGORIES = [
  "Temps liturgique",
  "Solennité",
  "Fête patronale",
  "Retraite",
  "Mois marial",
  "Octave",
  "Triduum",
  "Veillée",
  "Autre",
] as const;
