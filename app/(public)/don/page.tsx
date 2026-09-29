import type { Metadata } from "next";

import { ParcoursDon } from "@/components/don/parcours-don";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import {
  montantsSuggeres,
  projetDonParDefaut,
} from "@/features/setting/utils/don";
import { identiteParoisse } from "@/features/setting/utils/identite";

export const revalidate = 60;

const DESCRIPTION =
  "Soutenez la paroisse Saint Sauveur Miséricordieux et la construction de la nouvelle église : don en ligne sécurisé par Wave, en trois étapes.";

export const metadata: Metadata = {
  title: "Faire un don",
  description: DESCRIPTION,
  alternates: { canonical: "/don" },
  openGraph: {
    title: "Faire un don à la paroisse",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

type Props = {
  searchParams: Promise<{
    montant?: string;
    projet?: string;
    bienfaiteur?: string;
  }>;
};

export default async function PageDon({ searchParams }: Props) {
  const [{ montant, projet, bienfaiteur }, settings] = await Promise.all([
    searchParams,
    settingServerAPI.obtenirMap(),
  ]);
  const identite = identiteParoisse(settings);

  return (
    <ParcoursDon
      horairesSecretariat={(settings["parish.office_hours"] ?? "").trim()}
      montants={montantsSuggeres(settings)}
      prerempli={{
        montant: montant ? Number(montant) : undefined,
        projet,
        bienfaiteur: bienfaiteur === "1",
      }}
      projetEglise={projetDonParDefaut(settings)}
      telephone={identite.telephone}
    />
  );
}
