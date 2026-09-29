import { redirect } from "next/navigation";

/** Ancienne adresse des « Écoutes » : les demandes sont désormais dans Rendez-vous. */
export default function PageEcoutes() {
  redirect("/dashboard/rendez-vous");
}
