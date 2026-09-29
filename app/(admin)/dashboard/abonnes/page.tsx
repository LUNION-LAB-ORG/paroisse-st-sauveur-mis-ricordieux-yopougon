import type { Metadata } from "next";

import { EcranAbonnes } from "@/components/admin/abonnes/ecran-abonnes";

export const metadata: Metadata = { title: "Abonnés WhatsApp" };

export default function PageAbonnes() {
  return <EcranAbonnes />;
}
