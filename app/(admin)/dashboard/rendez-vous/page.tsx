import type { Metadata } from "next";

import { EcranRendezVous } from "@/components/admin/rendez-vous/ecran-rendez-vous";

export const metadata: Metadata = { title: "Rendez-vous" };

export default function PageRendezVous() {
  return <EcranRendezVous />;
}
