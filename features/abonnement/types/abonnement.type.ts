export type IListeAbonnement = "parole" | "annonces";

export interface IAbonnement {
  phone: string;
  lists: IListeAbonnement[];
}
