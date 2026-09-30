import type { Metadata } from "next";

import { EcranCommentaires } from "@/components/admin/contenus/commentaires/ecran-commentaires";

export const metadata: Metadata = { title: "Modération des commentaires" };

export default function PageCommentaires() {
  return <EcranCommentaires />;
}
