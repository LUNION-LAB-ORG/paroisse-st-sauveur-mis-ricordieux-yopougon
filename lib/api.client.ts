"use client";

import { baseURL } from "@/config/api";
import { Api } from "ak-api-http";
import { getSession } from "next-auth/react";

export const apiClient = new Api({
  baseUrl: baseURL,
  timeout: 10000,
  enableAuth: true,
  getSession: async () => {
    const session = await getSession();
    return { accessToken: (session as any)?.user?.token ?? "" };
  },
  signOut: async () => {},
  debug: process.env.NODE_ENV === "development",
});
