import type { IContenuStatut } from "@/features/pretre/types/pretre.type";

export interface IMembreConseil {
  name: string;
  function: string | null;
  /** Back-office uniquement : jamais renvoyé au site public */
  phone?: string | null;
}

export interface IConseil {
  id: number;
  name: string;
  role: string | null;
  leader_title: string | null;
  leader_name: string | null;
  status: IContenuStatut;
  sort_order: number;
  members?: IMembreConseil[];
}

export interface IConseilEnregistrer {
  name: string;
  role: string | null;
  leader_title: string | null;
  leader_name: string | null;
  status: IContenuStatut;
  members: IMembreConseil[];
  sort_order?: number;
}
