import { NavbarCommon } from "@/components/navbar";
import { Footer } from "@/components/navigation/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <NavbarCommon />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
