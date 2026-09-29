import type { Metadata } from "next";

import { Suspense } from "react";

import { EcranMesses } from "@/components/admin/messes/ecran-messes";

export const metadata: Metadata = { title: "Demandes de messe" };

export default function PageMesses() {
  return (
    <Suspense>
      <EcranMesses />
    </Suspense>
  );
}
