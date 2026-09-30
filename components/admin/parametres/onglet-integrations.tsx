"use client";

import type { IIntegration } from "@/features/admin/types/admin.type";
import type { IPropsOnglet } from "./types";

import { useQuery } from "@tanstack/react-query";

import {
  ChampChoixAdmin,
  ChampTexteAdmin,
  Pastille,
  TitreSection,
} from "@/components/admin/ui/kit";
import { adminAPI } from "@/features/admin/apis/admin.api";

const AGREGATEURS = [
  { valeur: "", label: "À choisir" },
  { valeur: "cinetpay", label: "CinetPay" },
  { valeur: "paydunya", label: "PayDunya" },
  { valeur: "autre", label: "Autre agrégateur" },
];

const SERVICES: Record<
  IIntegration["key"],
  { nom: string; description: string }
> = {
  aelf: {
    nom: "API AELF",
    description: "Zone : Afrique · import chaque nuit à 00:05",
  },
  whatsapp: {
    nom: "WhatsApp Business",
    description: "Numéro dédié · modèles de messages Meta",
  },
  youtube: {
    nom: "YouTube",
    description: "Lecture des vidéos des publications",
  },
  maps: { nom: "Google Maps", description: "Plan d’accès de la paroisse" },
  payment: {
    nom: "Paiements en ligne",
    description: "Mobile Money et carte via l’agrégateur",
  },
};

const ETAT: Record<
  IIntegration["status"],
  { libelle: string; ton: "succes" | "attention" | "danger" }
> = {
  connected: { libelle: "Connecté", ton: "succes" },
  not_configured: { libelle: "À configurer", ton: "attention" },
  error: { libelle: "Erreur", ton: "danger" },
};

/** Onglet « Paiements et intégrations ». */
export function OngletIntegrations({
  valeurs,
  changer,
  peutModifier,
  secretsDefinis,
}: IPropsOnglet) {
  const integrations = useQuery({
    queryKey: ["admin", "integrations"],
    queryFn: () => adminAPI.integrations(),
    enabled: peutModifier,
  });
  const paiementConfigure =
    !!valeurs["payment.aggregator"] &&
    (secretsDefinis["payment.api_key"] || !!valeurs["payment.api_key"]);

  return (
    <section className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-admin border border-bord-admin bg-white p-[22px]">
        <div className="flex items-center justify-between gap-3">
          <TitreSection>Paiements</TitreSection>
          <Pastille ton={paiementConfigure ? "succes" : "attention"}>
            {paiementConfigure ? "Configuré" : "À configurer"}
          </Pastille>
        </div>
        <ChampChoixAdmin
          isDisabled={!peutModifier}
          label="Agrégateur"
          options={AGREGATEURS}
          value={valeurs["payment.aggregator"] ?? ""}
          onChange={(v) => changer("payment.aggregator", v)}
        />
        <ChampTexteAdmin
          aide="Conservée côté serveur, jamais affichée sur le site."
          autoComplete="new-password"
          isDisabled={!peutModifier}
          label="Clé d’API"
          placeholder={
            secretsDefinis["payment.api_key"]
              ? "•••••••••••• (enregistrée — saisir pour remplacer)"
              : "Clé fournie par l’agrégateur"
          }
          type="password"
          value={valeurs["payment.api_key"] ?? ""}
          onChange={(v) => changer("payment.api_key", v)}
        />
        <ChampTexteAdmin
          isDisabled={!peutModifier}
          label="Offrande de messe indicative (FCFA)"
          placeholder="Ex. : 2000"
          value={valeurs["mass.offering_amount"] ?? ""}
          onChange={(v) =>
            changer("mass.offering_amount", v.replace(/[^\d]/g, ""))
          }
        />
        <ChampTexteAdmin
          aide="Séparez les montants par « · » ou une virgule."
          isDisabled={!peutModifier}
          label="Montants de don suggérés"
          value={(valeurs["donation.amounts"] ?? "")
            .split(",")
            .filter(Boolean)
            .join(" · ")}
          onChange={(v) =>
            changer(
              "donation.amounts",
              v
                .split(/[·,;]/)
                .map((x) => x.replace(/[^\d]/g, ""))
                .filter(Boolean)
                .join(","),
            )
          }
        />
      </div>

      <div className="flex flex-col gap-3 rounded-admin border border-bord-admin bg-white p-[22px]">
        <TitreSection>Services connectés</TitreSection>
        {integrations.isLoading && (
          <span className="text-sm text-gris">Chargement…</span>
        )}
        {integrations.isError && (
          <span className="text-sm text-rouge">
            L’état des services n’a pas pu être chargé.
          </span>
        )}
        {(integrations.data?.data ?? []).map((i, idx, liste) => {
          const s = SERVICES[i.key];
          const etat = ETAT[i.status];

          return (
            <div
              key={i.key}
              className={`flex items-center justify-between gap-3 py-3 ${idx < liste.length - 1 ? "border-b border-ligne-admin" : ""}`}
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-bold">{s?.nom ?? i.key}</span>
                <span className="text-[13px] text-gris">
                  {i.detail || s?.description}
                </span>
              </span>
              <Pastille ton={etat.ton}>{etat.libelle}</Pastille>
            </div>
          );
        })}
      </div>
    </section>
  );
}
