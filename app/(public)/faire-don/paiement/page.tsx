import { redirect } from "next/navigation";

/**
 * L'ancien formulaire multi-pages est remplacé par /don.
 * Les sous-routes /succes et /erreur restent : Wave y renvoie le donateur.
 */
export default function PageFaireDonPaiement() {
  redirect("/don");
}
