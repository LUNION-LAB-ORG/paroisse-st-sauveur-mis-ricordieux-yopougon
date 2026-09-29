import Content from "./content";

export default async function PageFaireDon({
  searchParams,
}: {
  searchParams: Promise<{ montant?: string; projet?: string; bienfaiteur?: string }>;
}) {
  const { montant, projet, bienfaiteur } = await searchParams;
  return (
    <>
      <Content
        prerempli={{
          montant: montant ? Number(montant) : undefined,
          projet,
          bienfaiteur: bienfaiteur === "1",
        }}
      />
    </>
  );
}
