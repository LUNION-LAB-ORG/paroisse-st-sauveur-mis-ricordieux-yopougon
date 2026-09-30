import { redirect } from "next/navigation";

/** Ancienne page de démonstration (données fictives) : remplacée par le tableau de bord. */
export default function PageContenuAncienne() {
  redirect("/dashboard");
}
