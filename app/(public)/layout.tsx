import { BandeauLiturgique } from "@/components/site/bandeau-liturgique";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { liturgieServerAPI } from "@/features/liturgie/apis/liturgie.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { dateDuJour } from "@/lib/charte";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, liturgie] = await Promise.all([
    settingServerAPI.obtenirMap(),
    liturgieServerAPI.obtenirDuJour(dateDuJour()),
  ]);
  const identite = identiteParoisse(settings);

  return (
    <div className="relative flex min-h-screen flex-col bg-parchemin font-body text-encre">
      <a
        className="sr-only z-50 bg-white px-4 py-2 font-bold text-marine focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        href="#contenu"
      >
        Aller au contenu
      </a>
      <BandeauLiturgique
        email={identite.email}
        liturgie={liturgie}
        telephone={identite.telephone}
      />
      <SiteHeader
        devise={identite.devise}
        logo={identite.logo}
        nom={identite.nom}
      />
      <main className="flex-grow" id="contenu">
        {children}
      </main>
      <SiteFooter identite={identite} />
    </div>
  );
}
