import { redirect } from "next/navigation";

/**
 * L'ancien formulaire multi-pages a été fusionné dans /faire-don.
 * Les sous-routes /succes et /erreur restent pour les callbacks Wave.
 */
export default function PageFaireDonPaiement() {
  redirect("/faire-don");
}
