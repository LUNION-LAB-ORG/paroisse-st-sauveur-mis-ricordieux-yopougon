import { baseURL } from "@/config/api";
import { Api } from "ak-api-http";
import { auth } from "./auth";

export const apiServer = new Api({
  baseUrl: baseURL,
  timeout: 10000,
  enableAuth: true,
  getSession: async () => {
    try {
      const session = await auth();
      return { accessToken: (session as any)?.user?.token ?? "" };
    } catch {
      return null;
    }
  },
  signOut: async () => {},
  debug: process.env.NODE_ENV === "development",
});
