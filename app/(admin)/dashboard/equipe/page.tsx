import type { Metadata } from "next";

import { EcranEquipe } from "@/components/admin/equipe/ecran-equipe";

export const metadata: Metadata = { title: "Équipe presbytérale" };

export default function PageEquipe() {
  return <EcranEquipe />;
}
