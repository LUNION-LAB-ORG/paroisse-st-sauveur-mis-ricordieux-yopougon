import type { Metadata } from "next";

import { EcranDons } from "@/components/admin/dons/ecran-dons";

export const metadata: Metadata = { title: "Dons et nouvelle église" };

export default function PageDons() {
  return <EcranDons />;
}
