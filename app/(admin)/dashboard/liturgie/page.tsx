import type { Metadata } from "next";

import { EcranLiturgie } from "@/components/admin/contenus/liturgie/ecran-liturgie";

export const metadata: Metadata = { title: "Parole du jour et homélie" };

export default function PageLiturgie() {
  return <EcranLiturgie />;
}
