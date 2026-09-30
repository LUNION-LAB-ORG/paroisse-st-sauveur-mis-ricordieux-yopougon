import { AncienModule } from "@/components/admin/ancien-module";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AncienModule>{children}</AncienModule>;
}
