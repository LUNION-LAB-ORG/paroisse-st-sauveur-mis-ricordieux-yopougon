"use client";

import { useSession } from "next-auth/react";

import {
  type IModule,
  LIBELLES_ROLES,
  peutModifier,
  peutVoir,
  roleConnu,
} from "../utils/roles";

/** Rôle de l'utilisateur connecté et droits associés (affichage uniquement). */
export function useDroits() {
  const { data } = useSession();
  const role = roleConnu(data?.user?.role);

  return {
    role,
    libelleRole: LIBELLES_ROLES[role],
    nom: data?.user?.name ?? "",
    serviceId: data?.user?.serviceId ?? null,
    estAdmin: role === "admin",
    peutModifier: (m: IModule) => peutModifier(role, m),
    peutVoir: (m: IModule) => peutVoir(role, m),
  };
}
