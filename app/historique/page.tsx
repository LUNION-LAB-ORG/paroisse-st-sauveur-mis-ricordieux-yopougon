import { getAllPastors } from "@/services/cure/cure.action";
import Content from "./content";

export default async function HistoriquePage() {
  const result = await getAllPastors();

  if (result.error) {
    return <div className="text-red-600">Erreur : {result.error}</div>;
  }

  const cure = result.data?.data ?? []; // Toujours un tableau

  return (
    <>
      <Content cure={cure} />
    </>
  );
}
