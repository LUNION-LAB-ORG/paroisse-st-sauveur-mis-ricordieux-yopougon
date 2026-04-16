import { notFound } from "next/navigation";
import Content from "./content";
import { apiServer } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  try {
    const result = await apiServer.get(`/services/${id}`, undefined, "public");
    const service = result?.data;
    if (!service) notFound();
    return <Content data={service} />;
  } catch {
    notFound();
  }
}
