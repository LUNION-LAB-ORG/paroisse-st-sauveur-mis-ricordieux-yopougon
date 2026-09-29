import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      role: string;
      serviceId: number | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    token: string;
    role: string;
    serviceId?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    token: string;
    role: string;
    serviceId?: number | null;
  }
}
