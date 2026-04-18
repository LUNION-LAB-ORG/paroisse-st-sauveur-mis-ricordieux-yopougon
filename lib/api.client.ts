"use client";

import { baseURL } from "@/config/api";
import { Api } from "ak-api-http";
import { getSession, signOut } from "next-auth/react";

/**
 * Client HTTP utilisé depuis les Client Components.
 *
 * `ak-api-http` appelle automatiquement notre callback `signOut()` dès qu'il
 * reçoit un 401 (cf. core.js l.124-127). On en profite pour déconnecter
 * NextAuth et rediriger vers /login, évitant l'affichage silencieux de pages
 * vides quand la session Laravel Sanctum est expirée.
 */
export const apiClient = new Api({
  baseUrl: baseURL,
  timeout: 10000,
  enableAuth: true,
  getSession: async () => {
    const session = await getSession();
    return { accessToken: (session as any)?.user?.token ?? "" };
  },
  signOut: async () => {
    // signOut redirige automatiquement vers /login via callbackUrl.
    // redirect: true force la navigation et vide le cookie côté client.
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch {
      // Fallback dur si NextAuth plante (ex : offline)
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  },
  debug: process.env.NODE_ENV === "development",
});
