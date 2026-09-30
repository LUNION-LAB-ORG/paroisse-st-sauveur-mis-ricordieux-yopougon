import type { Metadata } from "next";

import { Suspense } from "react";

import { EcranEvenements } from "@/components/admin/contenus/evenements/ecran-evenements";

export const metadata: Metadata = { title: "Événements" };

export default function PageEvenements() {
  return (
    <Suspense>
      <EcranEvenements />
    </Suspense>
  );
}
