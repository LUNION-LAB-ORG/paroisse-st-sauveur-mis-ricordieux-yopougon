import { redirect } from "next/navigation";

/** Ancienne fiche détaillée : la gestion se fait désormais sur un seul écran. */
export default function PageCureAncienne() {
  redirect("/dashboard/cure");
}
