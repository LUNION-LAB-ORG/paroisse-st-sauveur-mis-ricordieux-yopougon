"use client";

import { Button } from "@heroui/react";
import { ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { EtapesDemande } from "@/components/demande-messe/etapes-demande";
import {
  Recapitulatif,
  type ILigneRecap,
} from "@/components/demande-messe/recapitulatif";
import { CaseACocher, ChampTexte, ChampZone } from "@/components/site/champs";
import { FilAriane } from "@/components/site/fil-ariane";
import { MentionDonnees } from "@/components/site/mention-donnees";
import { waveAPI } from "@/features/don/apis/wave.api";
import { CONTENEUR, formatMontant } from "@/lib/charte";
import { cn } from "@/lib/utils";

const ETAPES = ["Montant et projet", "Coordonnées", "Paiement"] as const;
const MONTANT_MIN = 100;

/** Affectations proposées (clés enregistrées telles quelles dans `donations.project`). */
const AUTRES_PROJETS = [
  {
    key: "Fonctionnement",
    label: "Fonctionnement général",
    aide: "Entretien, électricité, vie quotidienne",
  },
  {
    key: "Actions caritatives",
    label: "Aide aux plus démunis",
    aide: "Soutien alimentaire et social",
  },
  {
    key: "Construction",
    label: "Construction / rénovation",
    aide: "Travaux des bâtiments existants",
  },
  {
    key: "Réfection toiture",
    label: "Réfection de la toiture",
    aide: "Chantier en cours",
  },
  {
    key: "Chorale - instruments",
    label: "Chorale et instruments",
    aide: "Animation de la liturgie",
  },
  {
    key: "Caisse paroisse",
    label: "Caisse de la paroisse",
    aide: "Là où le besoin est le plus grand",
  },
  { key: "Autre", label: "Autre projet", aide: "Précisez dans votre message" },
] as const;

/** Moyens de paiement : seul Wave est branché aujourd'hui. */
const MOYENS = [
  { id: "wave", label: "Wave", disponible: true },
  { id: "orange", label: "Orange Money", disponible: false },
  { id: "mtn", label: "MTN MoMo", disponible: false },
  { id: "moov", label: "Moov Money", disponible: false },
  { id: "carte", label: "Carte bancaire", disponible: false },
] as const;

/** Valeurs pré-remplies depuis le bloc « Faire un don » (?montant=&projet=&bienfaiteur=1). */
export interface IDonPrerempli {
  montant?: number;
  projet?: string;
  bienfaiteur?: boolean;
}

interface ParcoursDonProps {
  montants: number[];
  /** Projet « Nouvelle église » (paramètre donation.project_label) */
  projetEglise: string;
  prerempli: IDonPrerempli;
  telephone: string;
  horairesSecretariat: string;
}

const choix = (actif: boolean) =>
  cn(
    "flex min-h-11 flex-col items-start gap-1 rounded-charte p-4 text-left text-encre",
    actif
      ? "border-2 border-marine bg-[#EEF1FA]"
      : "border border-champ bg-white",
  );

function EnTeteEtape({ n, titre }: { n: number; titre: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-rouge">
        Étape {n} sur {ETAPES.length}
      </span>
      <h2 className="m-0 font-heading text-[22px] font-extrabold text-marine lg:text-[26px]">
        {titre}
      </h2>
    </div>
  );
}

export function ParcoursDon({
  montants,
  projetEglise,
  prerempli,
  telephone,
  horairesSecretariat,
}: ParcoursDonProps) {
  const projets = useMemo(
    () => [
      {
        key: projetEglise,
        label: "Construction de la nouvelle église",
        aide: "Le grand projet de la paroisse",
      },
      ...AUTRES_PROJETS.filter((p) => p.key !== projetEglise),
    ],
    [projetEglise],
  );

  const montantInitial =
    prerempli.montant &&
    Number.isInteger(prerempli.montant) &&
    prerempli.montant >= MONTANT_MIN
      ? prerempli.montant
      : null;
  const [etape, setEtape] = useState(1);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  // Étape 1
  const [montant, setMontant] = useState<number | null>(() =>
    montantInitial && montants.includes(montantInitial)
      ? montantInitial
      : montantInitial
        ? null
        : (montants[Math.min(2, montants.length - 1)] ?? null),
  );
  const [libre, setLibre] = useState(
    () => !!montantInitial && !montants.includes(montantInitial),
  );
  const [montantLibre, setMontantLibre] = useState(() =>
    montantInitial && !montants.includes(montantInitial)
      ? String(montantInitial)
      : "",
  );
  const [projet, setProjet] = useState<string>(() =>
    projets.some((p) => p.key === prerempli.projet)
      ? prerempli.projet!
      : projetEglise,
  );
  // Étape 2
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [bienfaiteur, setBienfaiteur] = useState(!!prerempli.bienfaiteur);
  // Étape 3
  const [moyen, setMoyen] = useState<string>("wave");
  const [envoi, setEnvoi] = useState(false);

  const total = libre ? Number(montantLibre) || 0 : (montant ?? 0);
  const libelleProjet = projets.find((p) => p.key === projet)?.label ?? projet;

  const recap: ILigneRecap[] = [
    { label: "Montant", valeur: total ? `${formatMontant(total)} FCFA` : "—" },
    { label: "Affectation", valeur: libelleProjet },
    {
      label: "Donateur",
      valeur: nom.trim()
        ? `${nom.trim()}${bienfaiteur ? " · cité parmi les bienfaiteurs" : ""}`
        : "—",
    },
    {
      label: "Paiement",
      valeur:
        etape >= 3 ? (MOYENS.find((m) => m.id === moyen)?.label ?? "—") : "—",
    },
  ];

  const valider = (n: number): boolean => {
    const e: Record<string, string> = {};

    if (n === 1) {
      if (!total || total < MONTANT_MIN || !Number.isInteger(total))
        e.montant = `Montant minimum : ${formatMontant(MONTANT_MIN)} FCFA.`;
      if (!projet) e.projet = "Choisissez l’affectation de votre don.";
    }
    if (n === 2) {
      if (!nom.trim()) e.nom = "Indiquez votre nom.";
      if (tel.trim() && !/^\+?\d{8,15}$/.test(tel.replace(/[^\d+]/g, "")))
        e.tel = "Numéro de téléphone invalide.";
      if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))
        e.email = "Adresse e-mail invalide.";
    }
    if (n === 3 && !MOYENS.find((m) => m.id === moyen)?.disponible)
      e.moyen = "Ce moyen de paiement sera bientôt disponible.";
    setErreurs(e);

    return Object.keys(e).length === 0;
  };

  const payer = async () => {
    setEnvoi(true);
    try {
      const r = await waveAPI.createCheckout({
        amount: total,
        type: "donation",
        donator: nom.trim() || "Anonyme",
        email: email.trim() || undefined,
        phone: tel.replace(/[^\d+]/g, "") || undefined,
        project: projet,
        display_name: bienfaiteur,
        description: message.trim() || `Don de ${nom.trim()} via le site`,
      });

      window.location.href = r.wave_launch_url;
    } catch (err) {
      setErreurs({
        general:
          err instanceof Error
            ? err.message
            : "Le paiement Wave n’a pas pu être lancé. Réessayez.",
      });
      setEnvoi(false);
    }
  };

  const suivant = () => {
    if (!valider(etape)) return;
    if (etape < ETAPES.length) {
      setEtape(etape + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else void payer();
  };

  const precedent = () => {
    setErreurs({});
    if (etape > 1) setEtape(etape - 1);
  };

  return (
    <>
      <section className="bg-marine text-white">
        <div className={cn(CONTENEUR, "flex flex-col gap-3 pt-9 lg:pt-11")}>
          <FilAriane
            surFondMarine
            etapes={[
              { label: "Accueil", href: "/" },
              { label: "Faire un don" },
            ]}
          />
          <h1 className="m-0 font-heading text-[30px] font-extrabold tracking-[-0.015em] lg:text-[40px]">
            Faire un don
          </h1>
          <span className="text-base text-brume lg:text-lg">
            Votre générosité fait vivre la paroisse et bâtit la nouvelle église.
            Trois étapes, paiement sécurisé par Wave.
          </span>
          <EtapesDemande
            etape={etape}
            label="Étapes du don"
            libelles={ETAPES}
          />
        </div>
      </section>

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-6 pb-16 pt-8 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[50px]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-[26px] border border-ligne bg-white p-5 lg:col-span-8 lg:min-h-[640px] lg:px-11 lg:py-10">
          {etape === 1 && (
            <div className="flex flex-col gap-6">
              <EnTeteEtape n={1} titre="Montant et affectation" />
              <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[15px] font-bold">
                  Montant du don (FCFA)
                </legend>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {montants.map((v) => {
                    const actif = !libre && montant === v;

                    return (
                      <button
                        key={v}
                        aria-pressed={actif}
                        className={cn(
                          "min-h-11 rounded-charte py-[13px] text-base font-semibold",
                          actif
                            ? "border border-marine bg-marine text-white"
                            : "border border-champ bg-white text-encre",
                        )}
                        type="button"
                        onClick={() => {
                          setLibre(false);
                          setMontant(v);
                          setErreurs({});
                        }}
                      >
                        {formatMontant(v)}
                      </button>
                    );
                  })}
                  <button
                    aria-pressed={libre}
                    className={cn(
                      "min-h-11 rounded-charte py-[13px] text-base font-semibold",
                      libre
                        ? "border border-marine bg-marine text-white"
                        : "border border-champ bg-white text-encre",
                    )}
                    type="button"
                    onClick={() => {
                      setLibre(true);
                      setErreurs({});
                    }}
                  >
                    Autre montant
                  </button>
                </div>
                {libre && (
                  <ChampTexte
                    className="sm:max-w-[260px]"
                    erreur={erreurs.montant}
                    inputMode="numeric"
                    label={
                      <span className="text-[15px] font-bold">
                        Montant libre (FCFA, minimum{" "}
                        {formatMontant(MONTANT_MIN)})
                      </span>
                    }
                    placeholder="Ex. : 15000"
                    value={montantLibre}
                    onChange={(v) => {
                      setMontantLibre(v.replace(/[^\d]/g, "").slice(0, 9));
                      setErreurs({});
                    }}
                  />
                )}
                {erreurs.montant && !libre && (
                  <p className="m-0 text-sm text-rouge">{erreurs.montant}</p>
                )}
              </fieldset>

              <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[15px] font-bold">
                  Affectation du don
                </legend>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {projets.map((p) => (
                    <button
                      key={p.key}
                      aria-pressed={p.key === projet}
                      className={choix(p.key === projet)}
                      type="button"
                      onClick={() => {
                        setProjet(p.key);
                        setErreurs({});
                      }}
                    >
                      <span className="text-base font-bold">{p.label}</span>
                      <span className="text-[13px] font-normal text-gris">
                        {p.aide}
                      </span>
                    </button>
                  ))}
                </div>
                {erreurs.projet && (
                  <p className="m-0 text-sm text-rouge">{erreurs.projet}</p>
                )}
              </fieldset>
            </div>
          )}

          {etape === 2 && (
            <div className="flex flex-col gap-[22px]">
              <EnTeteEtape n={2} titre="Vos coordonnées" />
              <p className="m-0 text-base leading-[1.55] text-gris">
                Pour vous remercier et vous envoyer un reçu.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChampTexte
                  autoComplete="name"
                  className="md:col-span-2"
                  erreur={erreurs.nom}
                  label={
                    <span className="text-[15px] font-bold">Nom et prénom</span>
                  }
                  maxLength={120}
                  placeholder="Ex. : Marie Konan"
                  value={nom}
                  onChange={setNom}
                />
                <ChampTexte
                  autoComplete="tel"
                  erreur={erreurs.tel}
                  label={
                    <span className="text-[15px] font-bold">
                      Téléphone ou WhatsApp{" "}
                      <span className="font-normal text-gris">
                        (facultatif)
                      </span>
                    </span>
                  }
                  placeholder="+225 07 00 00 00 00"
                  type="tel"
                  value={tel}
                  onChange={setTel}
                />
                <ChampTexte
                  autoComplete="email"
                  erreur={erreurs.email}
                  label={
                    <span className="text-[15px] font-bold">
                      E-mail{" "}
                      <span className="font-normal text-gris">
                        (facultatif)
                      </span>
                    </span>
                  }
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <ChampZone
                  className="md:col-span-2"
                  label={
                    <span className="text-[15px] font-bold">
                      Message à la paroisse{" "}
                      <span className="font-normal text-gris">
                        (facultatif)
                      </span>
                    </span>
                  }
                  maxLength={500}
                  placeholder="Intention, mot personnel…"
                  value={message}
                  onChange={setMessage}
                />
              </div>
              <CaseACocher valeur={bienfaiteur} onChange={setBienfaiteur}>
                Faire figurer mon nom parmi les bienfaiteurs
              </CaseACocher>
              <MentionDonnees finalite="servent uniquement à enregistrer votre don, à vous envoyer un reçu et, si vous l’avez choisi, à citer votre nom parmi les bienfaiteurs ; aucune donnée bancaire n’est conservée par la paroisse" />
            </div>
          )}

          {etape === 3 && (
            <div className="flex flex-col gap-[22px]">
              <EnTeteEtape n={3} titre="Paiement" />
              <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[15px] font-bold">
                  Moyen de paiement
                </legend>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                  {MOYENS.map((m) => (
                    <button
                      key={m.id}
                      aria-pressed={m.id === moyen}
                      className={cn(
                        "flex min-h-11 flex-col items-center justify-center rounded-charte px-2.5 py-[15px] text-[15px] font-semibold",
                        m.id === moyen
                          ? "border border-marine bg-marine text-white"
                          : "border border-champ bg-white text-encre",
                        !m.disponible && "cursor-not-allowed opacity-45",
                      )}
                      disabled={!m.disponible}
                      type="button"
                      onClick={() => {
                        setMoyen(m.id);
                        setErreurs({});
                      }}
                    >
                      {m.label}
                      {!m.disponible && (
                        <span className="text-xs font-normal">bientôt</span>
                      )}
                    </button>
                  ))}
                </div>
                {erreurs.moyen && (
                  <p className="m-0 text-sm text-rouge">{erreurs.moyen}</p>
                )}
              </fieldset>
              <div className="flex items-start gap-3 border-l-2 border-marine bg-parchemin p-4">
                <ShieldCheck
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-marine"
                  strokeWidth={2}
                />
                <p className="m-0 text-[15px] leading-[1.55] text-encre-douce">
                  Vous allez être redirigé vers Wave pour valider le paiement de{" "}
                  <strong className="text-marine">
                    {formatMontant(total)} FCFA
                  </strong>
                  . Aucune donnée bancaire n’est conservée par la paroisse :
                  seule la référence de la transaction est enregistrée.
                </p>
              </div>
            </div>
          )}

          {erreurs.general && (
            <p className="m-0 text-sm text-rouge" role="alert">
              {erreurs.general}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-ligne pt-6">
            {etape > 1 ? (
              <button
                className="min-h-11 rounded-charte border border-champ bg-transparent px-6 py-[15px] text-base font-semibold text-encre"
                disabled={envoi}
                type="button"
                onClick={precedent}
              >
                Retour
              </button>
            ) : (
              <span />
            )}
            <Button
              className="h-auto min-h-11 rounded-charte bg-rouge px-[30px] py-4 text-base font-bold text-white hover:bg-rouge-hover"
              isPending={envoi}
              onPress={suivant}
            >
              {etape === ETAPES.length
                ? `Payer ${formatMontant(total)} FCFA avec Wave`
                : "Continuer"}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
          <Recapitulatif lignes={recap} />
          <div className="flex flex-col gap-2 px-1 text-sm leading-[1.5] text-gris">
            <span>
              Vous préférez donner en espèces ou par chèque ? Le secrétariat
              paroissial vous remet un reçu
              {horairesSecretariat ? ` (${horairesSecretariat})` : ""}.
            </span>
            {telephone && <span>Une question ? {telephone}</span>}
          </div>
        </aside>
      </section>
    </>
  );
}
