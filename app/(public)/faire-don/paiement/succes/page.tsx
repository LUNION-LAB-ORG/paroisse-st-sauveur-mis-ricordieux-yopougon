import type { Metadata } from "next";

import { SuccesDon } from "./succes-don";

import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";

export const metadata: Metadata = {
  title: "Merci pour votre don",
  robots: { index: false },
};

export default async function PageSuccesDon() {
  const identite = identiteParoisse(await settingServerAPI.obtenirMap());

  return (
    <SuccesDon
      adresse={identite.adresse || "Yopougon Millionnaire, Abidjan"}
      nom={identite.nom}
      telephone={identite.telephone}
    />
  );
}
