import { apiServer } from "@/lib/api";
import Content from "./content";
import { MorphingSquare } from "@/components/morphing-square";

export default async function ActualitesPage() {
  let news: any[] = [];
  try {
    const result = await apiServer.get("/news", undefined, "public");
    news = result?.data ?? [];
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MorphingSquare />
      </div>
    );
  }

  return <Content news={news} />;
}
