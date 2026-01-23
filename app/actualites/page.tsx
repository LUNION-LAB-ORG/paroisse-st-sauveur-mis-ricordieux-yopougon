import { getAllNews } from "@/services/news/news.action";
import Content from "./content";
import { MorphingSquare } from "@/components/morphing-square";

export default async function ActualitesPage() {
  const result = await getAllNews();

  if (result.error) {
    return <div className="min-h-screen flex items-center justify-center "><MorphingSquare /></div>;
  }
  const news = result.data ?? [];

  return (
    <>
      <Content news={news} />
    </>
  );
}
