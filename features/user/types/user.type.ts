export type IUserRole = "admin" | "priest";
export type IUserStatus = "active" | "inactive";

export interface IUser {
  id: number;
  fullname: string;
  email: string | null;
  phone: string | null;
  status: IUserStatus;
  role: IUserRole | null;
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
  photo?: File | string | null;
}

export interface IUserModifier extends Partial<Omit<IUserCreer, "password">> {
  password?: string;
}

export const ROLE_LABELS: Record<IUserRole, { label: string; color: string }> = {
  admin: { label: "Administrateur", color: "bg-[#98141f]/10 text-[#98141f]" },
  priest: { label: "Prêtre", color: "bg-[#2d2d83]/10 text-[#2d2d83]" },
};
