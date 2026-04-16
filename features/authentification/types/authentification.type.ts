export interface IUtilisateur {
  id: number;
  email: string;
  nomComplet: string;
  nomUtilisateur: string;
  role: "GESTIONNAIRE" | "ADMIN" | "CAISSE";
  genre: "HOMME" | "FEMME" | "AUTRE";
  date_naissance: string;
  avatar?: string;
  created_at?: string;
}

export interface IConnexionPayload {
  email: string;
  password: string;
}

export interface IConnexionResponse {
  token: string;
  access_token?: string;
  user: IUtilisateur;
}

export interface IProfilResponse {
  id: number;
  email: string;
  nomComplet: string;
  nomUtilisateur: string;
  role: string;
  genre: string;
  date_naissance: string;
  avatar?: string;
}

export interface IActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
