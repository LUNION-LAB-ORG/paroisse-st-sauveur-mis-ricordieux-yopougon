import type { Metadata } from "next";

import { SuccesDemande } from "./succes-demande";

export const metadata: Metadata = {
  title: "Demande de messe confirmée",
  robots: { index: false },
};

/** Retour Wave de l'ancien parcours de demande de messe (?ref=). */
export default function PageSuccesDemande() {
  return <SuccesDemande />;
}
