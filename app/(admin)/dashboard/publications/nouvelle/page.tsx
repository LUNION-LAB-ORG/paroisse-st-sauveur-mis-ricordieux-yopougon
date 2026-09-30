import type { Metadata } from "next";

import { EditeurPublication } from "@/components/admin/contenus/publications/editeur-publication";

export const metadata: Metadata = { title: "Nouvelle publication" };

export default function PageNouvellePublication() {
  return <EditeurPublication />;
}
