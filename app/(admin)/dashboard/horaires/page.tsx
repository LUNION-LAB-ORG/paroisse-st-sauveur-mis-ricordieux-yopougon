import type { Metadata } from "next";

import { EcranHoraires } from "@/components/admin/contenus/horaires/ecran-horaires";

export const metadata: Metadata = { title: "Horaires" };

export default function PageHoraires() {
  return <EcranHoraires />;
}
