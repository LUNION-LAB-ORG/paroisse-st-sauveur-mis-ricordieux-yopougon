import { redirect } from "next/navigation";

/** Ancienne fiche événement : la fiche est désormais dans l'écran Événements. */
export default async function AncienneFicheEvenement({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(`/dashboard/evenements?id=${encodeURIComponent(id)}`);
}
