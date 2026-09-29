"use client";

import type { IValeurs } from "@/components/admin/parametres/types";

import { toast } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { OngletAccueil } from "@/components/admin/parametres/onglet-accueil";
import { OngletGeneral } from "@/components/admin/parametres/onglet-general";
import { OngletIntegrations } from "@/components/admin/parametres/onglet-integrations";
import { OngletUtilisateurs } from "@/components/admin/parametres/onglet-utilisateurs";
import {
  BoutonAdmin,
  ContenuAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { settingAPI } from "@/features/setting/apis/setting.api";
import { invalidateSettingsCache } from "@/features/setting/hooks/useSettings";
import { cn } from "@/lib/utils";

const ONGLETS = [
  { id: "general", label: "Général" },
  { id: "accueil", label: "Page d’accueil" },
  { id: "integrations", label: "Paiements et intégrations" },
  { id: "utilisateurs", label: "Utilisateurs et rôles" },
] as const;

type IOnglet = (typeof ONGLETS)[number]["id"];

function Parametres() {
  const recherche = useSearchParams();
  const router = useRouter();
  const client = useQueryClient();
  const { peutModifier, estAdmin } = useDroits();
  const onglet = (ONGLETS.find((o) => o.id === recherche.get("onglet"))?.id ??
    "general") as IOnglet;

  const reglages = useQuery({
    queryKey: ["admin", "parametres"],
    queryFn: () => settingAPI.obtenirGroupes(),
  });
  const [valeurs, setValeurs] = useState<IValeurs>({});
  const [modifies, setModifies] = useState<Set<string>>(new Set());
  const [envoi, setEnvoi] = useState(false);

  // Valeurs initiales, types et secrets déjà renseignés
  const { initiales, types, secretsDefinis } = useMemo(() => {
    const initiales: IValeurs = {};
    const types: Record<string, string> = {};
    const secretsDefinis: Record<string, boolean> = {};

    Object.values(reglages.data?.data ?? {})
      .flat()
      .forEach((s) => {
        types[s.key] = s.type;
        if (s.type === "secret") {
          secretsDefinis[s.key] = !!(s as { is_set?: boolean }).is_set;
          initiales[s.key] = "";
        } else initiales[s.key] = s.value ?? "";
      });

    return { initiales, types, secretsDefinis };
  }, [reglages.data]);

  useEffect(() => {
    setValeurs(initiales);
    setModifies(new Set());
  }, [initiales]);

  // Avertit avant de quitter la page avec des modifications non enregistrées
  useEffect(() => {
    if (!modifies.size) return;
    const avertir = (e: BeforeUnloadEvent) => e.preventDefault();

    window.addEventListener("beforeunload", avertir);

    return () => window.removeEventListener("beforeunload", avertir);
  }, [modifies]);

  const changer = (cle: string, valeur: string) => {
    setValeurs((v) => ({ ...v, [cle]: valeur }));
    setModifies((m) => new Set(m).add(cle));
  };

  const recharger = () => {
    invalidateSettingsCache();
    void client.invalidateQueries({ queryKey: ["admin", "parametres"] });
  };

  const enregistrer = async () => {
    // Un secret laissé vide n'écrase pas la valeur enregistrée
    const liste = Array.from(modifies)
      .filter((k) => !(types[k] === "secret" && !valeurs[k]))
      .map((key) => ({ key, value: valeurs[key] ?? "" }));

    if (!liste.length) {
      toast.info("Aucune modification à enregistrer.");

      return;
    }
    setEnvoi(true);
    try {
      await settingAPI.modifier(liste);
      toast.success(
        "Paramètres enregistrés. Le site est mis à jour sous une minute.",
      );
      setModifies(new Set());
      recharger();
    } catch (e) {
      toast.danger(
        e instanceof Error ? e.message : "L’enregistrement a échoué.",
      );
    } finally {
      setEnvoi(false);
    }
  };

  const choisirOnglet = (id: IOnglet) =>
    router.replace(`/dashboard/parametres?onglet=${id}`, { scroll: false });
  const onglets = ONGLETS.filter((o) =>
    o.id === "utilisateurs" || o.id === "integrations" ? estAdmin : true,
  );
  const props = {
    valeurs,
    changer,
    types,
    secretsDefinis,
    peutModifier: peutModifier("parametres"),
    recharger,
  };

  return (
    <>
      <header className="flex flex-col gap-2.5 border-b border-bord-admin bg-white px-4 pt-4 md:px-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="m-0 font-heading text-xl font-extrabold text-marine md:text-[22px]">
            Paramètres et utilisateurs
          </h1>
          {onglet !== "utilisateurs" && peutModifier("parametres") && (
            <BoutonAdmin
              isDisabled={!modifies.size}
              isPending={envoi}
              variante="marine"
              onPress={enregistrer}
            >
              Enregistrer{modifies.size ? ` (${modifies.size})` : ""}
            </BoutonAdmin>
          )}
        </div>
        <div
          aria-label="Rubriques des paramètres"
          className="-mb-px flex gap-7 overflow-x-auto"
          role="tablist"
        >
          {onglets.map((o) => (
            <button
              key={o.id}
              aria-selected={o.id === onglet}
              className={cn(
                "shrink-0 border-b-[3px] pb-3 pt-2 text-[15px]",
                o.id === onglet
                  ? "border-rouge font-bold text-marine"
                  : "border-transparent text-gris hover:text-encre",
              )}
              role="tab"
              type="button"
              onClick={() => choisirOnglet(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </header>

      <ContenuAdmin>
        {reglages.isError && (
          <ErreurChargement
            message="Les paramètres n’ont pas pu être chargés."
            onReessayer={() => reglages.refetch()}
          />
        )}
        {reglages.isLoading ? (
          <p className="m-0 text-sm text-gris">Chargement…</p>
        ) : (
          <>
            {onglet === "general" && <OngletGeneral {...props} />}
            {onglet === "accueil" && <OngletAccueil {...props} />}
            {onglet === "integrations" && estAdmin && (
              <OngletIntegrations {...props} />
            )}
            {onglet === "utilisateurs" && <OngletUtilisateurs />}
          </>
        )}
      </ContenuAdmin>
    </>
  );
}

export default function PageParametres() {
  return (
    <Suspense>
      <Parametres />
    </Suspense>
  );
}
