import type { Metadata } from "next";

import { Suspense } from "react";

import { ListeCelebrant } from "@/components/admin/messes/liste-celebrant";

export const metadata: Metadata = { title: "Liste du célébrant" };

export default function PageListeCelebrant() {
  return (
    <Suspense>
      <ListeCelebrant />
    </Suspense>
  );
}
