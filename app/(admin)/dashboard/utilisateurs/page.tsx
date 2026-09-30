import { redirect } from "next/navigation";

/** Les utilisateurs se gèrent désormais dans Paramètres › Utilisateurs et rôles. */
export default function PageUtilisateurs() {
  redirect("/dashboard/parametres?onglet=utilisateurs");
}
