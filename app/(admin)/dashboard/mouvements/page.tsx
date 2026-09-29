import type { Metadata } from "next";

import { EcranMouvements } from "@/components/admin/mouvements/ecran-mouvements";

export const metadata: Metadata = { title: "Mouvements et groupes" };

export default function PageMouvements() {
  return <EcranMouvements />;
}
