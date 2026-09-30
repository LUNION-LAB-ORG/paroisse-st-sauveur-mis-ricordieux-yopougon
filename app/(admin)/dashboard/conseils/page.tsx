import type { Metadata } from "next";

import { EcranConseils } from "@/components/admin/conseils/ecran-conseils";

export const metadata: Metadata = { title: "Conseils paroissiaux" };

export default function PageConseils() {
  return <EcranConseils />;
}
