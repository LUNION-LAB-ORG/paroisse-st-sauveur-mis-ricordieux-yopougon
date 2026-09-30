import { redirect } from "next/navigation";

/** Ancienne page de création : la saisie est désormais dans l'écran Événements. */
export default function AncienNouvelEvenement() {
  redirect("/dashboard/evenements?nouveau=1");
}
