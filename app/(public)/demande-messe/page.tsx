import type { Metadata } from "next";

import { ParcoursDemandeMesse } from "@/components/demande-messe/parcours-demande-messe";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Demander une messe",
  description:
    "Confiez une intention à la prière de la communauté : une messe, un triduum ou une neuvaine, en quatre étapes.",
};

export default async function PageDemandeMesse() {
  const identite = identiteParoisse(await settingServerAPI.obtenirMap());

  return <ParcoursDemandeMesse telephone={identite.telephone} />;
}
