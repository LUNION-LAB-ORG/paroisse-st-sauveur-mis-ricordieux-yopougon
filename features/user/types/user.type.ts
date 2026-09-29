export type IUserRole =
  | "admin"
  | "priest"
  | "secretariat"
  | "communication"
  | "treasurer"
  | "movement_leader";
export type IUserStatus = "active" | "inactive";

export interface IUser {
  id: number;
  fullname: string;
  email: string | null;
  phone: string | null;
  status: IUserStatus;
  role: IUserRole | null;
  /** Responsable de mouvement : sa fiche (services.id) */
  service_id?: number | null;
  last_login_at?: string | null;
  photo: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface IUserCreer {
  fullname: string;
  email?: string;
  phone: string;
  password: string;
  status?: IUserStatus;
  role?: IUserRole;
  service_id?: number | null;
  photo?: File | string | null;
}

export interface IUserModifier extends Partial<Omit<IUserCreer, "password">> {
  password?: string;
}

export const ROLE_LABELS: Record<IUserRole, { label: string; color: string }> =
  {
    admin: { label: "Administrateur", color: "bg-[#98141f]/10 text-[#98141f]" },
    priest: { label: "Curé / prêtre", color: "bg-[#2d2d83]/10 text-[#2d2d83]" },
    secretariat: {
      label: "Secrétariat",
      color: "bg-[#2d2d83]/10 text-[#2d2d83]",
    },
    communication: {
      label: "Communication",
      color: "bg-[#2d2d83]/10 text-[#2d2d83]",
    },
    treasurer: { label: "Trésorier", color: "bg-[#2d2d83]/10 text-[#2d2d83]" },
    movement_leader: {
      label: "Responsable de mouvement",
      color: "bg-[#2d2d83]/10 text-[#2d2d83]",
    },
  };
