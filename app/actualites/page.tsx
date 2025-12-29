import { getAllNews } from "@/services/news/news.action";
import Content from "./content";

export default async function ActualitesPage() {
  const result = await getAllNews();

  if (result.error) {
    return <div className="text-red-600">Erreur : {result.error}</div>;
  }
  const news = result.data ?? [];
 
  return (
    <>
      <Content news={news} />
    </>
  );
}
