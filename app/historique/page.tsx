import { getAllPastors } from "@/services/cure/cure.action";
import Content from "./content";
import { MorphingSquare } from "@/components/morphing-square";

export default async function HistoriquePage() {
  const result = await getAllPastors();

  if (result.error) {
    return <div className="min-h-screen flex items-center justify-center"><MorphingSquare /></div>;
  }
  const cure = result.data?.data ?? []; // Toujours un tableau
  return (
    <>
      <Content cure={cure} />
    </>
  );
}
