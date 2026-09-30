import type { Metadata } from "next";

import { EcranAnnonces } from "@/components/admin/contenus/annonces/ecran-annonces";

export const metadata: Metadata = { title: "Annonces" };

export default function PageAnnonces() {
  return <EcranAnnonces />;
}
