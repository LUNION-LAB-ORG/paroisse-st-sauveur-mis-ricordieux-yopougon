import type { IListeAbonnement } from "./abonnement.type";

/** Abonné WhatsApp côté back-office (`SubscriptionResource`). */
export interface IAbonne {
  id: number;
  phone: string;
  lists: IListeAbonnement[];
  source: string | null;
  consented_at: string | null;
  unsubscribed_at: string | null;
  created_at: string | null;
}

export interface IStatsAbonnes {
  lists: Partial<Record<IListeAbonnement, number>>;
  unsubscribed_30d: number;
}

export type IStatutAbonne = "active" | "unsubscribed" | "";
