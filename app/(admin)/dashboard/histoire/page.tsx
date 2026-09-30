import type { Metadata } from "next";

import { EcranHistoire } from "@/components/admin/contenus/histoire/ecran-histoire";

export const metadata: Metadata = { title: "Histoire et mot du curé" };

export default function PageHistoire() {
  return <EcranHistoire />;
}
