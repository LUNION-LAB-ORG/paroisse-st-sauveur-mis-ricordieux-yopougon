"use client";

import type {
  ICreneauMesse,
  IDisponibilites,
  IFormule,
  IMoyenPaiement,
} from "@/features/demande-messe/types/demande-messe.type";

import { Button, Checkbox } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EtapesDemande } from "./etapes-demande";
import { Recapitulatif, type ILigneRecap } from "./recapitulatif";

import { ChampTexte, ChampZone } from "@/components/site/champs";
import { FilAriane } from "@/components/site/fil-ariane";
import { demandeMesseAPI } from "@/features/demande-messe/apis/demande-messe.api";
import { CONTENEUR, dateDuJour, formatMontant } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const TYPES_INTENTION = [
  {
    label: "Action de grâce",
    aide: "Remercier Dieu",
    pour: "Action de grâce pour",
  },
  {
    label: "Repos de l’âme",
    aide: "Pour un défunt",
    pour: "Pour le repos de l’âme de",
  },
  { label: "Guérison", aide: "Pour un malade", pour: "Pour la guérison de" },
  {
    label: "Protection",
    aide: "Personne, famille, voyage",
    pour: "Pour la protection de",
  },
  {
    label: "Bénédiction",
    aide: "Projet, foyer, examen",
    pour: "Pour la bénédiction de",
  },
  {
    label: "Autre intention",
    aide: "Précisez ci-dessous",
    pour: "Intention pour",
  },
] as const;

export const FORMULES: {
  id: IFormule;
  label: string;
  aide: string;
  n: number;
}[] = [
  { id: "single", label: "Une messe", aide: "À la date choisie", n: 1 },
  { id: "triduum", label: "Triduum", aide: "3 jours consécutifs", n: 3 },
  { id: "novena", label: "Neuvaine", aide: "9 jours consécutifs", n: 9 },
];

/** Seuls Wave et le secrétariat sont branchés ; les autres attendent l'agrégateur. */
export const MOYENS: {
  id: IMoyenPaiement;
  label: string;
  disponible: boolean;
}[] = [
  { id: "orange", label: "Orange Money", disponible: false },
  { id: "mtn", label: "MTN MoMo", disponible: false },
  { id: "moov", label: "Moov Money", disponible: false },
  { id: "wave", label: "Wave", disponible: true },
  { id: "card", label: "Carte bancaire", disponible: false },
  { id: "secretariat", label: "Au secrétariat", disponible: true },
];

const JOURS_COURTS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const LIBELLE_STATUT: Record<ICreneauMesse["status"], string> = {
  available: "Disponible",
  almost_full: "Presque complète",
  full: "Complète",
  too_late: "Délai dépassé",
};

/** « mardi 29 septembre » */
export const dateLongueMinuscule = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const jour = d.getUTCDate() === 1 ? "1er" : String(d.getUTCDate());

  return `${new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: "UTC" }).format(d)} ${jour} ${new Intl.DateTimeFormat("fr-FR", { month: "long", timeZone: "UTC" }).format(d)}`;
};

const moisCourt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

/** Style des cartes de choix (type, formule) et des lignes (créneau, offrande). */
const choix = (actif: boolean) =>
  cn(
    "flex min-h-11 flex-col items-start gap-1 rounded-charte p-4 text-left text-encre",
    actif
      ? "border-2 border-marine bg-[#EEF1FA]"
      : "border border-champ bg-white",
  );
const ligne = (actif: boolean, desactive = false) =>
  cn(
    "flex min-h-11 w-full items-center gap-4 rounded-charte px-[18px] py-4 text-base text-encre",
    actif
      ? "border-2 border-marine bg-[#EEF1FA]"
      : "border border-champ bg-white",
    desactive && "cursor-not-allowed opacity-50",
  );

interface ParcoursProps {
  telephone: string;
}

export function ParcoursDemandeMesse({ telephone }: ParcoursProps) {
  const router = useRouter();
  const [etape, setEtape] = useState(1);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  // Étape 1
  const [type, setType] = useState(0);
  const [pour, setPour] = useState("");
  const [intention, setIntention] = useState("");
  const [confidentielle, setConfidentielle] = useState(false);
  // Étape 2
  const [formule, setFormule] = useState<IFormule>("single");
  const [dispo, setDispo] = useState<IDisponibilites | null>(null);
  const [erreurDispo, setErreurDispo] = useState(false);
  const [fenetre, setFenetre] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [creneauId, setCreneauId] = useState<number | null>(null);
  // Étape 3
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [present, setPresent] = useState(false);
  const [rappel, setRappel] = useState(true);
  // Étape 4
  const [offrande, setOffrande] = useState<"indicative" | "free">("indicative");
  const [montantLibre, setMontantLibre] = useState("");
  const [moyen, setMoyen] = useState<IMoyenPaiement>("wave");
  const [envoi, setEnvoi] = useState(false);

  // Disponibilités sur 4 semaines, affichées par fenêtre de 7 jours
  useEffect(() => {
    demandeMesseAPI
      .disponibilites(dateDuJour(), 28)
      .then((r) => {
        setDispo(r.data);
        if (r.data.offering_amount == null) setOffrande("free");
        const premier = r.data.days.find((j) =>
          j.slots.some(
            (s) => s.status === "available" || s.status === "almost_full",
          ),
        );

        if (premier) {
          setDate(premier.date);
          setFenetre(Math.floor(r.data.days.indexOf(premier) / 7));
        }
      })
      .catch(() => setErreurDispo(true));
  }, []);

  const t = TYPES_INTENTION[type];
  const f = FORMULES.find((x) => x.id === formule)!;
  const jours = dispo?.days.slice(fenetre * 7, fenetre * 7 + 7) ?? [];
  const jourChoisi = dispo?.days.find((j) => j.date === date) ?? null;
  const creneaux = jourChoisi?.slots ?? [];
  const creneau = creneaux.find((c) => c.time_slot_id === creneauId) ?? null;
  const offrandeUnitaire = dispo?.offering_amount ?? null;
  const total =
    offrande === "indicative" && offrandeUnitaire
      ? offrandeUnitaire * f.n
      : Number(montantLibre) || 0;

  // Sélectionne automatiquement le premier créneau libre du jour choisi
  useEffect(() => {
    const libre = creneaux.find(
      (c) => c.status === "available" || c.status === "almost_full",
    );

    setCreneauId(libre?.time_slot_id ?? null);
  }, [date]);

  const recap: ILigneRecap[] = useMemo(
    () => [
      {
        label: "Intention",
        valeur: t.label + (confidentielle ? " · confidentielle" : ""),
      },
      { label: "Pour", valeur: pour.trim() || "—" },
      {
        label: "Célébration",
        valeur: date
          ? `${f.label}${f.n > 1 ? ", à partir du " : ", le "}${dateLongueMinuscule(date)}`
          : f.label,
      },
      {
        label: "Messe",
        valeur: creneau ? `${creneau.time} · ${creneau.label}` : "—",
      },
      {
        label: "Offrande",
        valeur:
          offrande === "indicative" && offrandeUnitaire
            ? f.n > 1
              ? `${f.n} × ${formatMontant(offrandeUnitaire)} = ${formatMontant(offrandeUnitaire * f.n)} FCFA`
              : `${formatMontant(offrandeUnitaire)} FCFA`
            : montantLibre
              ? `${formatMontant(Number(montantLibre))} FCFA (montant libre)`
              : "Montant libre",
      },
      {
        label: "Paiement",
        valeur: etape >= 4 ? MOYENS.find((m) => m.id === moyen)!.label : "—",
      },
    ],
    [
      t,
      confidentielle,
      pour,
      date,
      f,
      creneau,
      offrande,
      offrandeUnitaire,
      montantLibre,
      etape,
      moyen,
    ],
  );

  const valider = (n: number): boolean => {
    const e: Record<string, string> = {};

    if (n === 1 && !pour.trim())
      e.pour = "Indiquez pour qui la messe sera offerte.";
    if (n === 2) {
      if (!date) e.date = "Choisissez une date.";
      else if (!creneau) e.creneau = "Choisissez une messe disponible.";
    }
    if (n === 3) {
      if (!nom.trim()) e.nom = "Indiquez votre nom.";
      if (!/^\+?\d{8,15}$/.test(tel.replace(/[^\d+]/g, "")))
        e.tel = "Numéro WhatsApp invalide.";
      if (email && !/^\S+@\S+\.\S+$/.test(email))
        e.email = "Adresse e-mail invalide.";
    }
    if (n === 4) {
      if (
        offrande === "free" &&
        (!Number(montantLibre) ||
          Number(montantLibre) < (dispo?.min_offering ?? 0) ||
          Number(montantLibre) < 100)
      ) {
        e.montant = `Montant minimum : ${formatMontant(Math.max(dispo?.min_offering ?? 0, 100))} FCFA.`;
      }
      if (!MOYENS.find((m) => m.id === moyen)?.disponible)
        e.moyen = "Ce moyen de paiement sera bientôt disponible.";
    }
    setErreurs(e);

    return Object.keys(e).length === 0;
  };

  const soumettre = async () => {
    if (!date || !creneau) return;
    setEnvoi(true);
    try {
      const r = await demandeMesseAPI.creer({
        intention_type: t.label,
        for_whom: pour.trim(),
        intention: intention.trim() || undefined,
        is_confidential: confidentielle,
        formula: formule,
        date,
        time_slot_id: creneau.time_slot_id,
        fullname: nom.trim(),
        phone: tel.replace(/[^\d+]/g, ""),
        email: email.trim() || undefined,
        will_attend: present,
        reminder: rappel,
        offering: offrande,
        ...(offrande === "free" ? { amount: Number(montantLibre) } : {}),
        payment_method: moyen,
      });

      if (r.data.wave_launch_url) {
        window.location.href = r.data.wave_launch_url;

        return;
      }
      router.push(
        `/demande-messe/confirmation?n=${encodeURIComponent(r.data.number)}&t=${encodeURIComponent(r.data.access_token)}`,
      );
    } catch (err) {
      setErreurs({
        general:
          err instanceof Error
            ? err.message
            : "La demande n’a pas pu être enregistrée.",
      });
      setEnvoi(false);
    }
  };

  const suivant = () => {
    if (!valider(etape)) return;
    if (etape < 4) {
      setEtape(etape + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else void soumettre();
  };

  const precedent = () => {
    setErreurs({});
    if (etape > 1) setEtape(etape - 1);
    else router.push("/");
  };

  return (
    <>
      <section className="bg-marine text-white">
        <div className={cn(CONTENEUR, "flex flex-col gap-3 pt-9 lg:pt-11")}>
          <FilAriane
            surFondMarine
            etapes={[
              { label: "Accueil", href: "/" },
              { label: "Services" },
              { label: "Demander une messe" },
            ]}
          />
          <h1 className="m-0 font-heading text-[30px] font-extrabold tracking-[-0.015em] lg:text-[40px]">
            Demander une messe
          </h1>
          <span className="text-base text-brume lg:text-lg">
            Confiez une intention à la prière de la communauté. Quatre étapes,
            environ deux minutes.
          </span>
          <EtapesDemande etape={etape} />
        </div>
      </section>

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-6 pb-16 pt-8 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[50px]",
        )}
      >
        <div className="flex flex-col gap-[26px] border border-ligne bg-white p-5 lg:col-span-8 lg:min-h-[820px] lg:px-11 lg:py-10">
          {etape === 1 && (
            <div className="flex flex-col gap-6">
              <EnTeteEtape n={1} titre="Votre intention" />
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[15px] font-bold">
                  Type d’intention
                </legend>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                  {TYPES_INTENTION.map((x, i) => (
                    <button
                      key={x.label}
                      aria-pressed={i === type}
                      className={choix(i === type)}
                      type="button"
                      onClick={() => setType(i)}
                    >
                      <span className="text-base font-bold">{x.label}</span>
                      <span className="text-[13px] font-normal text-gris">
                        {x.aide}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <ChampTexte
                erreur={erreurs.pour}
                label={<span className="text-[15px] font-bold">{t.pour}…</span>}
                maxLength={150}
                placeholder="Ex. : la famille Kouassi, feu Jean Koffi…"
                value={pour}
                onChange={(v) => {
                  setPour(v);
                  setErreurs({});
                }}
              />
              <div className="flex flex-col gap-1">
                <ChampZone
                  label={
                    <span className="text-[15px] font-bold">
                      Votre intention{" "}
                      <span className="font-normal text-gris">
                        (facultatif — lue pendant la messe)
                      </span>
                    </span>
                  }
                  maxLength={250}
                  placeholder="Rédigez votre intention en quelques mots."
                  rows={4}
                  value={intention}
                  onChange={(v) => setIntention(v.slice(0, 250))}
                />
                <span className="text-right text-[13px] text-gris">
                  {intention.length} / 250
                </span>
              </div>
              <CaseACocher valeur={confidentielle} onChange={setConfidentielle}>
                Intention confidentielle : le prêtre la confie sans lire les
                noms à voix haute.
              </CaseACocher>
            </div>
          )}

          {etape === 2 && (
            <div className="flex flex-col gap-6">
              <EnTeteEtape n={2} titre="Date et célébration" />
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[15px] font-bold">
                  Nombre de messes
                </legend>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {FORMULES.map((x) => (
                    <button
                      key={x.id}
                      aria-pressed={x.id === formule}
                      className={choix(x.id === formule)}
                      type="button"
                      onClick={() => setFormule(x.id)}
                    >
                      <span className="text-base font-bold">{x.label}</span>
                      <span className="text-[13px] font-normal text-gris">
                        {x.aide}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-2.5">
                <span className="text-[15px] font-bold">
                  {f.n > 1 ? "Date de la première messe" : "Date de la messe"}
                </span>
                {erreurDispo ? (
                  <p className="m-0 text-sm text-rouge">
                    Les horaires n’ont pas pu être chargés. Réessayez ou
                    contactez le secrétariat.
                  </p>
                ) : !dispo ? (
                  <p className="m-0 text-sm text-gris">
                    Chargement des horaires…
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {jours.map((j) => {
                        const actif = j.date === date;
                        const aucune = !j.slots.some(
                          (s) =>
                            s.status === "available" ||
                            s.status === "almost_full",
                        );

                        return (
                          <button
                            key={j.date}
                            aria-pressed={actif}
                            className={cn(
                              "flex min-h-11 flex-col items-center gap-0.5 rounded-charte py-3",
                              actif
                                ? "border border-marine bg-marine text-white"
                                : "border border-champ bg-white text-encre",
                              aucune && "cursor-not-allowed opacity-40",
                            )}
                            disabled={aucune}
                            type="button"
                            onClick={() => {
                              setDate(j.date);
                              setErreurs({});
                            }}
                          >
                            <span className="text-xs sm:text-[13px]">
                              {JOURS_COURTS[j.weekday]}
                            </span>
                            <span className="font-heading text-lg font-bold sm:text-[22px]">
                              {Number(j.date.slice(8, 10))}
                            </span>
                            <span className="text-[11px] sm:text-xs">
                              {moisCourt(j.date)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-5">
                      {fenetre > 0 && (
                        <button
                          className="flex min-h-11 items-center gap-1 py-1.5 text-[15px] font-bold text-rouge underline underline-offset-4"
                          type="button"
                          onClick={() => setFenetre(fenetre - 1)}
                        >
                          <ChevronLeft aria-hidden className="size-4" />
                          Semaine précédente
                        </button>
                      )}
                      {(fenetre + 1) * 7 < dispo.days.length && (
                        <button
                          className="flex min-h-11 items-center gap-1 py-1.5 text-[15px] font-bold text-rouge underline underline-offset-4"
                          type="button"
                          onClick={() => setFenetre(fenetre + 1)}
                        >
                          Choisir une autre date
                          <ChevronRight aria-hidden className="size-4" />
                        </button>
                      )}
                    </div>
                    {erreurs.date && (
                      <p className="m-0 text-sm text-rouge">{erreurs.date}</p>
                    )}
                  </>
                )}
              </div>

              {jourChoisi && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[15px] font-bold">Messe</span>
                  {creneaux.length === 0 ? (
                    <p className="m-0 text-sm text-gris">
                      Aucune messe ce jour-là.
                    </p>
                  ) : (
                    creneaux.map((c) => {
                      const indispo =
                        c.status === "full" || c.status === "too_late";

                      return (
                        <button
                          key={c.time_slot_id}
                          aria-pressed={c.time_slot_id === creneauId}
                          className={ligne(
                            c.time_slot_id === creneauId,
                            indispo,
                          )}
                          disabled={indispo}
                          type="button"
                          onClick={() => {
                            setCreneauId(c.time_slot_id);
                            setErreurs({});
                          }}
                        >
                          <span className="w-[70px] text-left font-bold text-marine sm:w-[90px]">
                            {c.time}
                          </span>
                          <span className="grow text-left">{c.label}</span>
                          <span
                            className={cn(
                              "text-sm",
                              c.status === "almost_full"
                                ? "font-semibold text-rouge"
                                : "text-gris",
                            )}
                          >
                            {LIBELLE_STATUT[c.status]}
                          </span>
                        </button>
                      );
                    })
                  )}
                  {erreurs.creneau && (
                    <p className="m-0 text-sm text-rouge">{erreurs.creneau}</p>
                  )}
                  {f.n > 1 && (
                    <p className="m-0 text-[13px] leading-[1.5] text-gris">
                      Les messes suivantes sont célébrées les jours consécutifs
                      à la même heure. Si une messe n’a pas lieu, elle est
                      reportée au jour suivant et le secrétariat vous prévient.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {etape === 3 && (
            <div className="flex flex-col gap-[22px]">
              <EnTeteEtape n={3} titre="Vos coordonnées" />
              <p className="m-0 text-base leading-[1.55] text-gris">
                Elles servent uniquement à vous confirmer la messe et à vous
                envoyer le reçu.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChampTexte
                  autoComplete="name"
                  erreur={erreurs.nom}
                  label={
                    <span className="text-[15px] font-bold">Nom et prénom</span>
                  }
                  value={nom}
                  onChange={setNom}
                />
                <ChampTexte
                  autoComplete="tel"
                  erreur={erreurs.tel}
                  label={
                    <span className="text-[15px] font-bold">
                      Numéro WhatsApp
                    </span>
                  }
                  placeholder="+225 07 00 00 00 00"
                  type="tel"
                  value={tel}
                  onChange={setTel}
                />
                <ChampTexte
                  autoComplete="email"
                  className="md:col-span-2"
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
              </div>
              <CaseACocher valeur={present} onChange={setPresent}>
                Je serai présent(e) à la messe.
              </CaseACocher>
              <CaseACocher valeur={rappel} onChange={setRappel}>
                Recevoir un rappel WhatsApp la veille de la messe.
              </CaseACocher>
            </div>
          )}

          {etape === 4 && (
            <div className="flex flex-col gap-[22px]">
              <EnTeteEtape n={4} titre="Offrande et paiement" />
              <p className="m-0 text-base leading-[1.6] text-encre-douce">
                L’offrande de messe soutient la vie des prêtres et de la
                paroisse. Son montant indicatif est fixé par la paroisse selon
                les orientations de l’archidiocèse.
              </p>
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[15px] font-bold">
                  Offrande
                </legend>
                {offrandeUnitaire != null && (
                  <button
                    aria-pressed={offrande === "indicative"}
                    className={ligne(offrande === "indicative")}
                    type="button"
                    onClick={() => setOffrande("indicative")}
                  >
                    <span className="grow text-left font-bold">
                      Offrande indicative
                    </span>
                    <span className="text-[15px] font-bold text-marine">
                      {formatMontant(offrandeUnitaire)} FCFA / messe
                    </span>
                  </button>
                )}
                <button
                  aria-pressed={offrande === "free"}
                  className={ligne(offrande === "free")}
                  type="button"
                  onClick={() => setOffrande("free")}
                >
                  <span className="grow text-left font-bold">
                    Autre montant
                  </span>
                  <span className="text-[15px] font-bold text-marine">
                    Libre
                  </span>
                </button>
                {offrande === "free" && (
                  <ChampTexte
                    className="sm:w-[260px]"
                    erreur={erreurs.montant}
                    inputMode="numeric"
                    label={
                      <span className="text-[15px] font-bold">
                        Montant (FCFA)
                      </span>
                    }
                    placeholder="Ex. : 5000"
                    value={montantLibre}
                    onChange={(v) => setMontantLibre(v.replace(/[^\d]/g, ""))}
                  />
                )}
              </fieldset>
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
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
                {moyen === "secretariat" && (
                  <p className="m-0 text-[13px] leading-[1.5] text-gris">
                    Votre demande est enregistrée « à régler » : vous remettez
                    l’offrande au secrétariat paroissial.
                  </p>
                )}
              </fieldset>
            </div>
          )}

          {erreurs.general && (
            <p className="m-0 text-sm text-rouge">{erreurs.general}</p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-ligne pt-6">
            <button
              className="min-h-11 rounded-charte border border-champ bg-transparent px-6 py-[15px] text-base font-semibold text-encre"
              type="button"
              onClick={precedent}
            >
              {etape === 1 ? "Annuler" : "Retour"}
            </button>
            <Button
              className="h-auto min-h-11 rounded-charte bg-rouge px-[30px] py-4 text-base font-bold text-white hover:bg-rouge-hover"
              isPending={envoi}
              onPress={suivant}
            >
              {etape === 4
                ? moyen === "secretariat"
                  ? "Valider ma demande"
                  : `Payer ${formatMontant(total)} FCFA et valider`
                : "Continuer"}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
          <Recapitulatif lignes={recap} />
          <div className="flex flex-col gap-2 px-1 text-sm leading-[1.5] text-gris">
            {telephone && (
              <span>Une question ? Secrétariat paroissial : {telephone}</span>
            )}
            <span>
              Vous pouvez aussi déposer votre intention directement au
              secrétariat.
            </span>
          </div>
        </aside>
      </section>
    </>
  );
}

function EnTeteEtape({ n, titre }: { n: number; titre: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-rouge">Étape {n} sur 4</span>
      <h2 className="m-0 font-heading text-[22px] font-extrabold text-marine lg:text-[26px]">
        {titre}
      </h2>
    </div>
  );
}

function CaseACocher({
  valeur,
  onChange,
  children,
}: {
  valeur: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Checkbox className="group" isSelected={valeur} onChange={onChange}>
      <Checkbox.Content className="flex flex-row items-start gap-3 text-[15px] leading-[1.45] text-encre-douce">
        <Checkbox.Control className="mt-0.5 size-5 shrink-0 rounded-[2px] border border-champ bg-white group-data-[selected=true]:border-marine group-data-[selected=true]:bg-marine group-data-[selected=true]:text-white">
          <Checkbox.Indicator />
        </Checkbox.Control>
        {children}
      </Checkbox.Content>
    </Checkbox>
  );
}
