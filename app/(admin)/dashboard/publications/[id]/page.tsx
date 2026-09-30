import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { EditeurPublication } from "@/components/admin/contenus/publications/editeur-publication";

export const metadata: Metadata = { title: "Modifier la publication" };

export default async function PageModifierPublication({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = Number(id);

  if (!Number.isInteger(n) || n <= 0) notFound();

  return <EditeurPublication id={n} />;
}
