"use client";

import type {
  IEvenementAdmin,
  IEvenementSaisie,
} from "@/features/evenement/types/evenement-admin.type";

import { toast } from "@heroui/react";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { dateEvenement, heure, participationInitiale } from "./utils";

import { SaisieCompacte } from "@/components/admin/contenus/champs-compacts";
import { erreursChamps } from "@/components/admin/contenus/erreur-api";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  CaseAdmin,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ChampZoneAdmin,
} from "@/components/admin/ui/kit";
import {
  useEnregistrerEvenementMutation,
  useSupprimerEvenementAdminMutation,
} from "@/features/evenement/queries/evenement-admin.mutation";

interface IEtape {
  cle: string;
  time: string;
  label: string;
}

type IErreurs = Partial<
  Record<
    | "title"
    | "debut"
    | "end_time"
    | "location_at"
    | "participation"
    | "max_participants"
    | "programme"
    | "summary",
    string
  >
>;

const LIBRE = /^(libre|gratuit(e)?|)$/i;

export function FicheEvenement({
  evenement,
  peutEcrire,
  onCree,
  onSupprime,
}: {
  evenement: IEvenementAdmin | null;
  peutEcrire: boolean;
  onCree: (id: number) => void;
  onSupprime: () => void;
}) {
  const e = evenement;
  const plusieursTarifs = (e?.pricing_tiers?.length ?? 0) > 1;
  const participation0 = useMemo(() => participationInitiale(e), [e]);

  const [titre, setTitre] = useState(e?.title ?? "");
  const [debut, setDebut] = useState(
    e && dateEvenement(e)
      ? `${dateEvenement(e)}T${heure(e.time_at) || "09:00"}`
      : "",
  );
  const [fin, setFin] = useState(heure(e?.end_time));
  const [lieu, setLieu] = useState(e?.location_at ?? "");
  const [participation, setParticipation] = useState(participation0);
  const [description, setDescription] = useState(e?.description ?? "");
  const [etapes, setEtapes] = useState<IEtape[]>(() =>
    (e?.programme ?? []).map((p, i) => ({
      cle: `p${i}`,
      time: p.time ?? "",
      label: p.label ?? "",
    })),
  );
  const [ouvertes, setOuvertes] = useState(e?.registrations_open ?? true);
  const [jauge, setJauge] = useState(
    e?.max_participants ? String(e.max_participants) : "",
  );
  const [resume, setResume] = useState(e?.summary ?? "");
  const [categorie, setCategorie] = useState(e?.category ?? "");
  const [public_, setPublic] = useState(e?.audience ?? "");
  const [statut, setStatut] = useState<IEvenementSaisie["status"]>(
    e?.status ?? "published",
  );
  const [affiche, setAffiche] = useState<File | null>(null);
  const [erreurs, setErreurs] = useState<IErreurs>({});
  const entree = useRef<HTMLInputElement>(null);

  const enregistrer = useEnregistrerEvenementMutation();
  const supprimer = useSupprimerEvenementAdminMutation();
  const { confirmer, fenetre } = useConfirmation();
  const enCours = enregistrer.isPending || supprimer.isPending;
  const inactif = !peutEcrire || enCours;

  const apercu = useMemo(
    () => (affiche ? URL.createObjectURL(affiche) : null),
    [affiche],
  );

  useEffect(
    () => () => {
      if (apercu) URL.revokeObjectURL(apercu);
    },
    [apercu],
  );

  const majEtape = (cle: string, champ: Partial<IEtape>) =>
    setEtapes((l) => l.map((x) => (x.cle === cle ? { ...x, ...champ } : x)));

  const soumettre = () => {
    const r: IErreurs = {};
    const [date, heureDebut] = debut.split("T");

    if (!titre.trim()) r.title = "Indiquez le titre de l’événement.";
    if (!date || !heureDebut) r.debut = "Indiquez la date et l’heure de début.";
    if (fin && heureDebut && fin <= heureDebut.slice(0, 5))
      r.end_time = "L’heure de fin doit suivre le début.";
    if (!lieu.trim()) r.location_at = "Indiquez le lieu.";
    else if (lieu.length > 150) r.location_at = "150 caractères au maximum.";
    const p = participation.trim().replace(/\s|F(CFA)?$/gi, "");

    if (!plusieursTarifs && !LIBRE.test(p) && !/^\d+$/.test(p))
      r.participation = "Indiquez « Libre » ou un montant en FCFA.";
    if (jauge && (!/^\d+$/.test(jauge) || Number(jauge) < 1))
      r.max_participants = "Nombre entier supérieur à 0.";
    const programme = etapes
      .filter((x) => x.time.trim() || x.label.trim())
      .map((x) => ({ time: x.time.trim(), label: x.label.trim() }));

    if (programme.some((x) => !x.label))
      r.programme = "Chaque étape du programme doit avoir un libellé.";
    if (resume.length > 500) r.summary = "500 caractères au maximum.";
    setErreurs(r);
    if (Object.keys(r).length) return;

    const data: IEvenementSaisie = {
      title: titre.trim(),
      date_at: date,
      time_at: heureDebut.slice(0, 5),
      end_time: fin || null,
      location_at: lieu.trim(),
      description: description.trim() || null,
      summary: resume.trim() || null,
      category: categorie.trim() || null,
      audience: public_.trim() || null,
      programme,
      registrations_open: ouvertes,
      max_participants: jauge ? Number(jauge) : null,
      status: statut,
    };

    if (!plusieursTarifs && (participation !== participation0 || !e)) {
      const payant = /^\d+$/.test(p) && Number(p) > 0;

      data.is_paid = payant;
      data.price = payant ? Number(p) : null;
      data.pricing_tiers = null;
    }

    enregistrer.mutate(
      { id: e?.id, data, affiche },
      {
        onSuccess: ({ evenement: cree }) => {
          setAffiche(null);
          if (!e && cree?.id) onCree(cree.id);
        },
        onError: (err) => {
          const champs = erreursChamps(err);

          setErreurs({
            title: champs.title,
            debut: champs.date_at ?? champs.time_at,
            end_time: champs.end_time,
            location_at: champs.location_at,
            max_participants: champs.max_participants,
            participation: champs.price ?? champs.is_paid,
            summary: champs.summary,
            programme: Object.entries(champs).find(([k]) =>
              k.startsWith("programme"),
            )?.[1],
          });
        },
      },
    );
  };

  const image = apercu ?? e?.image ?? null;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 px-5 py-5 md:grid-cols-2 md:px-6 md:py-[22px]">
      {fenetre}
      <ChampTexteAdmin
        className="md:col-span-2"
        erreur={erreurs.title}
        isDisabled={inactif}
        label="Titre"
        maxLength={255}
        value={titre}
        onChange={setTitre}
      />
      <ChampTexteAdmin
        erreur={erreurs.debut}
        isDisabled={inactif}
        label="Début"
        type="datetime-local"
        value={debut}
        onChange={setDebut}
      />
      <ChampTexteAdmin
        aide="Heure de fin, le même jour"
        erreur={erreurs.end_time}
        isDisabled={inactif}
        label="Fin"
        type="time"
        value={fin}
        onChange={setFin}
      />
      <ChampTexteAdmin
        erreur={erreurs.location_at}
        isDisabled={inactif}
        label="Lieu"
        maxLength={150}
        value={lieu}
        onChange={setLieu}
      />
      <ChampTexteAdmin
        aide={
          plusieursTarifs
            ? "Plusieurs tarifs sont définis pour cet événement ; ils sont conservés."
            : undefined
        }
        erreur={erreurs.participation}
        isDisabled={inactif || plusieursTarifs}
        label="Participation"
        placeholder="Libre ou montant en FCFA"
        value={participation}
        onChange={setParticipation}
      />
      <ChampZoneAdmin
        className="md:col-span-2"
        isDisabled={inactif}
        label="Description"
        rows={3}
        value={description}
        onChange={setDescription}
      />

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm font-bold">Programme</span>
        {etapes.map((x) => (
          <div
            key={x.cle}
            className="grid grid-cols-[88px_minmax(0,1fr)_36px] gap-2 sm:grid-cols-[110px_minmax(0,1fr)_40px]"
          >
            <SaisieCompacte
              ariaLabel="Heure"
              isDisabled={inactif}
              maxLength={20}
              placeholder="HH:MM"
              saisieClassName="p-[9px]"
              value={x.time}
              onChange={(v) => majEtape(x.cle, { time: v })}
            />
            <SaisieCompacte
              ariaLabel="Étape"
              isDisabled={inactif}
              maxLength={255}
              saisieClassName="p-[9px]"
              value={x.label}
              onChange={(v) => majEtape(x.cle, { label: v })}
            />
            {peutEcrire && (
              <button
                aria-label="Retirer cette étape"
                className="flex items-center justify-center rounded-admin border border-[#E8C4CB] bg-white text-rouge hover:bg-[#FBEAED] disabled:opacity-50"
                disabled={inactif}
                type="button"
                onClick={() =>
                  setEtapes((l) => l.filter((y) => y.cle !== x.cle))
                }
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
        ))}
        {erreurs.programme && (
          <span className="text-[13px] text-rouge">{erreurs.programme}</span>
        )}
        {peutEcrire && (
          <button
            className="self-start rounded-admin border-[1.5px] border-dashed border-champ bg-white px-3 py-2 text-[13px] font-bold text-marine hover:border-marine disabled:opacity-50"
            disabled={inactif}
            type="button"
            onClick={() =>
              setEtapes((l) => [
                ...l,
                { cle: `n${Date.now()}`, time: "", label: "" },
              ])
            }
          >
            + Ajouter une étape
          </button>
        )}
      </div>

      <details className="group rounded-admin border border-bord-admin md:col-span-2">
        <summary className="cursor-pointer list-none px-3.5 py-2.5 text-sm font-bold text-marine">
          <span className="group-open:hidden">+ </span>
          <span className="hidden group-open:inline">− </span>
          Présentation sur le site et statut
        </summary>
        <div className="grid grid-cols-1 gap-3.5 border-t border-bord-admin p-3.5 md:grid-cols-2">
          <ChampZoneAdmin
            compteur
            aide="Chapeau affiché sur l’agenda"
            className="md:col-span-2"
            erreur={erreurs.summary}
            isDisabled={inactif}
            label="Résumé"
            maxLength={500}
            rows={2}
            value={resume}
            onChange={setResume}
          />
          <ChampTexteAdmin
            isDisabled={inactif}
            label="Catégorie"
            maxLength={100}
            placeholder="Ex. Événement paroissial"
            value={categorie}
            onChange={setCategorie}
          />
          <ChampTexteAdmin
            isDisabled={inactif}
            label="Public"
            maxLength={255}
            placeholder="Ex. Toute la communauté"
            value={public_}
            onChange={setPublic}
          />
          <ChampChoixAdmin
            isDisabled={inactif}
            label="Statut"
            options={[
              { valeur: "published", label: "Publié sur le site" },
              { valeur: "draft", label: "Brouillon (non visible)" },
              { valeur: "hidden", label: "Masqué" },
            ]}
            value={statut}
            onChange={(v) => setStatut(v as IEvenementSaisie["status"])}
          />
        </div>
      </details>

      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <CaseAdmin
          isDisabled={inactif}
          valeur={ouvertes}
          onChange={setOuvertes}
        >
          Inscriptions ouvertes
        </CaseAdmin>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm font-semibold">
            Jauge
            <input
              aria-invalid={!!erreurs.max_participants || undefined}
              className="w-[90px] rounded-admin border border-champ bg-white p-2 text-sm font-normal outline-none focus:border-marine disabled:bg-entete-admin"
              disabled={inactif}
              min={1}
              placeholder="—"
              type="number"
              value={jauge}
              onChange={(ev) => setJauge(ev.target.value)}
            />
          </label>
          {erreurs.max_participants && (
            <span className="text-[13px] text-rouge">
              {erreurs.max_participants}
            </span>
          )}
        </div>
      </div>

      {peutEcrire && (
        <div className="flex flex-wrap items-center justify-end gap-2.5 md:col-span-2">
          {e && (
            <BoutonAdmin
              className="mr-auto"
              isDisabled={enCours}
              variante="lien"
              onPress={async () => {
                if (
                  await confirmer({
                    titre: "Supprimer cet événement ?",
                    message: `« ${e.title} » sera retiré de l’agenda. Les inscriptions associées ne seront plus consultables ici.`,
                    libelleConfirmer: "Supprimer",
                    danger: true,
                  })
                )
                  supprimer.mutate(e.id, { onSuccess: onSupprime });
              }}
            >
              Supprimer
            </BoutonAdmin>
          )}
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Affiche de l’événement"
              className="h-11 w-11 rounded-admin border border-bord-admin object-cover"
              src={image}
            />
          )}
          <BoutonAdmin
            isDisabled={inactif}
            variante="neutre"
            onPress={() => entree.current?.click()}
          >
            {affiche
              ? "Affiche choisie"
              : e?.image
                ? "Changer l’affiche"
                : "Ajouter l’affiche"}
          </BoutonAdmin>
          <input
            ref={entree}
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            tabIndex={-1}
            type="file"
            onChange={(ev) => {
              const f = ev.target.files?.[0];

              ev.target.value = "";
              if (!f) return;
              if (f.size > 5 * 1024 * 1024) {
                toast.danger("L’affiche dépasse 5 Mo.");

                return;
              }
              setAffiche(f);
            }}
          />
          <BoutonAdmin
            className="px-5"
            isDisabled={enCours}
            isPending={enregistrer.isPending}
            variante="marine"
            onPress={soumettre}
          >
            Enregistrer
          </BoutonAdmin>
        </div>
      )}
    </div>
  );
}
