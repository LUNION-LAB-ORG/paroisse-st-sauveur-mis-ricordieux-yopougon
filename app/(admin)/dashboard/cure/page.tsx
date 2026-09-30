import type { Metadata } from "next";

import { EcranCures } from "@/components/admin/cures/ecran-cures";

export const metadata: Metadata = { title: "Curés successifs" };

export default function PageCures() {
  return <EcranCures />;
}
