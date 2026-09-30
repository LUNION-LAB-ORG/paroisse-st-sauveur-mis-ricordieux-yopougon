import type { Metadata } from "next";

import { ListePublications } from "@/components/admin/contenus/publications/liste-publications";

export const metadata: Metadata = { title: "Publications" };

export default function PagePublications() {
  return <ListePublications />;
}
