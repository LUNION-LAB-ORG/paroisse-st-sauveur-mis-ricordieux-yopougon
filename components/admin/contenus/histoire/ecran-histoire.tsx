"use client";

import type { IJalon } from "@/features/histoire/types/histoire.type";
import type { ISetting } from "@/features/setting/types/setting.type";

import { toast } from "@heroui/react";
import { useRef, useState } from "react";

import { ChampZoneRiche } from "@/components/admin/contenus/champ-zone";
import { SaisieCompacte } from "@/components/admin/contenus/champs-compacts";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  ChampTexteAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  useChangerPortraitMutation,
  useEnregistrerHistoireMutation,
} from "@/features/histoire/queries/histoire-admin.mutation";
import {
  useJalonsAdminQuery,
  useParametresHistoireQuery,
} from "@/features/histoire/queries/histoire-admin.query";
import { cn } from "@/lib/utils";

const CLES = {
  histoire: "history.full_text",
  extrait: "pastor_word.message",
  complet: "pastor_word.full_message",
  signature: "pastor_word.signature",
  photo: "pastor_word.photo",
} as const;

const INDISPONIBLE = "Champ disponible après la mise à jour du serveur.";

interface ILigne {
  cle: string;
  id?: number;
  year: string;
  title: string;
}

function Poignee() {
  return (
    <svg aria-hidden fill="#8A8896" height="14" viewBox="0 0 24 24" width="14">
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

/** Écran « Histoire et mot du curé ». */
export function EcranHistoire() {
  const jalons = useJalonsAdminQuery();
  const parametres = useParametresHistoireQuery();
  const [version, setVersion] = useState(0);

  const erreur = jalons.error ?? parametres.error;

  if (jalons.isLoading || parametres.isLoading || erreur) {
    return (
      <>
        <EnTeteAdmin
          sousTitre="Section « Notre histoire » et « Le mot du curé » de l’accueil, page Histoire"
          titre="Histoire et mot du curé"
        />
        <ContenuAdmin>
          {erreur ? (
            <ErreurChargement
              message={`Les contenus n’ont pas pu être chargés. ${messageErreur(erreur)}`}
              onReessayer={() => {
                jalons.refetch();
                parametres.refetch();
              }}
            />
          ) : (
            <p className="m-0 text-sm text-gris">Chargement…</p>
          )}
        </ContenuAdmin>
      </>
    );
  }

  return (
    <FormulaireHistoire
      key={version}
      jalons={jalons.data ?? []}
      parametres={parametres.data ?? {}}
      onEnregistre={() => setVersion((v) => v + 1)}
    />
  );
}

function FormulaireHistoire({
  jalons,
  parametres,
  onEnregistre,
}: {
  jalons: IJalon[];
  parametres: Record<string, ISetting>;
  onEnregistre: () => void;
}) {
  const droits = useDroits();
  const peutHistoire = droits.peutModifier("histoire");
  // Mot du curé : administrateur et prêtres seulement (contrôle serveur).
  const peutCure = droits.role === "admin" || droits.role === "priest";
  const existe = (k: string) => k in parametres;
  const valeur = (k: string) => parametres[k]?.value ?? "";

  const initiales = jalons.map<ILigne>((j) => ({
    cle: `j${j.id}`,
    id: j.id,
    year: j.year,
    title: j.title,
  }));
  const [lignes, setLignes] = useState<ILigne[]>(initiales);
  const [supprimes, setSupprimes] = useState<number[]>([]);
  const [histoire, setHistoire] = useState(valeur(CLES.histoire));
  const [extrait, setExtrait] = useState(valeur(CLES.extrait));
  const [complet, setComplet] = useState(valeur(CLES.complet));
  const [signature, setSignature] = useState(valeur(CLES.signature));
  const [erreurs, setErreurs] = useState<
    Record<string, { year?: string; title?: string }>
  >({});
  const [poignee, setPoignee] = useState<number | null>(null);
  const [glisse, setGlisse] = useState<number | null>(null);
  const entreePortrait = useRef<HTMLInputElement>(null);

  const enregistrer = useEnregistrerHistoireMutation();
  const portrait = useChangerPortraitMutation();
  const { confirmer, fenetre } = useConfirmation();
  const inactifHistoire = !peutHistoire || enregistrer.isPending;
  const inactifCure = !peutCure || enregistrer.isPending;
  const photo = valeur(CLES.photo);

  const maj = (cle: string, champ: Partial<ILigne>) =>
    setLignes((l) => l.map((x) => (x.cle === cle ? { ...x, ...champ } : x)));

  const deplacer = (de: number, vers: number) => {
    if (vers < 0 || vers >= lignes.length || de === vers) return;
    setLignes((l) => {
      const copie = [...l];
      const [x] = copie.splice(de, 1);

      copie.splice(vers, 0, x);

      return copie;
    });
  };

  const retirer = async (l: ILigne) => {
    if (
      l.id &&
      !(await confirmer({
        titre: "Retirer cette date ?",
        message: `« ${l.year} — ${l.title} » sera supprimée à l’enregistrement.`,
        libelleConfirmer: "Retirer",
        danger: true,
      }))
    )
      return;
    setLignes((ls) => ls.filter((x) => x.cle !== l.cle));
    if (l.id) setSupprimes((s) => [...s, l.id as number]);
  };

  const soumettre = () => {
    const e: typeof erreurs = {};

    if (peutHistoire)
      for (const l of lignes) {
        const r: { year?: string; title?: string } = {};

        if (!l.year.trim()) r.year = "Année requise.";
        else if (l.year.length > 20) r.year = "20 caractères max.";
        if (!l.title.trim()) r.title = "Événement requis.";
        if (r.year || r.title) e[l.cle] = r;
      }
    setErreurs(e);
    if (Object.keys(e).length) {
      toast.danger("Complétez les dates signalées avant d’enregistrer.");

      return;
    }

    const avant = new Map(initiales.map((j) => [j.id, j]));
    const params: { key: string; value: string | null }[] = [];
    const ajouter = (k: string, v: string) => {
      if (existe(k) && v !== valeur(k))
        params.push({ key: k, value: v || null });
    };

    if (peutHistoire) ajouter(CLES.histoire, histoire);
    if (peutCure) {
      ajouter(CLES.extrait, extrait);
      ajouter(CLES.complet, complet);
      ajouter(CLES.signature, signature);
    }
    const jalonsSaisis = peutHistoire
      ? lignes.map((l) => {
          const o = l.id ? avant.get(l.id) : undefined;

          return {
            id: l.id,
            year: l.year.trim(),
            title: l.title.trim(),
            modifie:
              !o || o.year !== l.year.trim() || o.title !== l.title.trim(),
          };
        })
      : [];
    const ordreModifie =
      peutHistoire &&
      lignes
        .filter((l) => l.id)
        .map((l) => l.id)
        .join(",") !==
        initiales
          .filter((j) => !supprimes.includes(j.id as number))
          .map((j) => j.id)
          .join(",");

    const rien =
      !params.length &&
      !supprimes.length &&
      !ordreModifie &&
      !jalonsSaisis.some((j) => j.modifie);

    if (rien) {
      toast.info("Aucune modification à enregistrer.");

      return;
    }
    enregistrer.mutate(
      { jalons: jalonsSaisis, ordreModifie, supprimes, parametres: params },
      { onSuccess: onEnregistre },
    );
  };

  return (
    <>
      {fenetre}
      <EnTeteAdmin
        actions={
          (peutHistoire || peutCure) && (
            <BoutonAdmin
              className="px-5"
              isPending={enregistrer.isPending}
              variante="marine"
              onPress={soumettre}
            >
              Enregistrer
            </BoutonAdmin>
          )
        }
        sousTitre="Section « Notre histoire » et « Le mot du curé » de l’accueil, page Histoire"
        titre="Histoire et mot du curé"
      />
      <ContenuAdmin>
        <LectureSeule visible={!peutHistoire && !peutCure} />
        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-2">
          <section className="flex min-w-0 flex-col gap-3.5 rounded-admin border border-bord-admin bg-white p-5 md:p-[22px]">
            <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
              Grandes dates de la paroisse
            </h2>
            {lignes.length === 0 && (
              <p className="m-0 text-sm text-gris">
                Aucune date pour le moment.
              </p>
            )}
            <ul
              aria-label="Grandes dates (glisser pour changer l’ordre)"
              className="m-0 flex list-none flex-col gap-2.5 p-0"
            >
              {lignes.map((l, i) => {
                const e = erreurs[l.cle] ?? {};

                return (
                  <li
                    key={l.cle}
                    className={cn(
                      "grid grid-cols-[24px_80px_minmax(0,1fr)_40px] items-start gap-2 sm:grid-cols-[24px_110px_minmax(0,1fr)_40px] sm:gap-2.5",
                      glisse === i && "opacity-50",
                    )}
                    draggable={poignee === i}
                    onDragEnd={() => {
                      setGlisse(null);
                      setPoignee(null);
                    }}
                    onDragOver={(ev) => ev.preventDefault()}
                    onDragStart={() => setGlisse(i)}
                    onDrop={(ev) => {
                      ev.preventDefault();
                      if (glisse !== null) deplacer(glisse, i);
                      setGlisse(null);
                      setPoignee(null);
                    }}
                  >
                    <button
                      aria-label={`Déplacer « ${l.year || "nouvelle date"} » (flèches haut et bas)`}
                      className="flex h-10 cursor-grab items-center justify-center rounded-admin hover:bg-entete-admin active:cursor-grabbing disabled:cursor-default disabled:opacity-40"
                      disabled={inactifHistoire}
                      type="button"
                      onKeyDown={(ev) => {
                        if (ev.key === "ArrowUp") {
                          ev.preventDefault();
                          deplacer(i, i - 1);
                        } else if (ev.key === "ArrowDown") {
                          ev.preventDefault();
                          deplacer(i, i + 1);
                        }
                      }}
                      onMouseDown={() => setPoignee(i)}
                      onMouseUp={() => setPoignee(null)}
                    >
                      <Poignee />
                    </button>
                    <SaisieCompacte
                      ariaLabel="Année"
                      erreur={e.year}
                      isDisabled={inactifHistoire}
                      maxLength={20}
                      saisieClassName="p-2.5"
                      value={l.year}
                      onChange={(v) => maj(l.cle, { year: v })}
                    />
                    <SaisieCompacte
                      ariaLabel="Événement"
                      erreur={e.title}
                      isDisabled={inactifHistoire}
                      maxLength={255}
                      saisieClassName="p-2.5"
                      value={l.title}
                      onChange={(v) => maj(l.cle, { title: v })}
                    />
                    <button
                      aria-label="Retirer cette date"
                      className="size-10 rounded-admin border border-[#E8C4CB] bg-white text-lg text-rouge hover:bg-[#FBEAED] disabled:opacity-40"
                      disabled={inactifHistoire}
                      type="button"
                      onClick={() => retirer(l)}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
            {peutHistoire && (
              <button
                className="self-start rounded-admin border-[1.5px] border-dashed border-champ bg-white px-3.5 py-2.5 text-sm font-bold text-marine hover:border-marine disabled:opacity-50"
                disabled={inactifHistoire}
                type="button"
                onClick={() =>
                  setLignes((l) => [
                    ...l,
                    { cle: `n${Date.now()}`, year: "", title: "" },
                  ])
                }
              >
                + Ajouter une date
              </button>
            )}
            <ChampZoneRiche
              aide={existe(CLES.histoire) ? undefined : INDISPONIBLE}
              className="mt-2"
              isDisabled={inactifHistoire || !existe(CLES.histoire)}
              label={
                <>
                  Histoire complète{" "}
                  <span className="font-normal text-gris">(page Histoire)</span>
                </>
              }
              rows={7}
              value={histoire}
              onChange={setHistoire}
            />
          </section>

          <section className="flex min-w-0 flex-col gap-3.5 rounded-admin border border-bord-admin bg-white p-5 md:p-[22px]">
            <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
              Le mot du curé
            </h2>
            {!peutCure && peutHistoire && (
              <p className="m-0 text-[13px] text-gris">
                Seuls l’administrateur et les prêtres peuvent modifier le mot du
                curé.
              </p>
            )}
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
              <div className="flex h-[170px] w-[140px] items-center justify-center overflow-hidden rounded-admin bg-lin text-[13px] text-gris-clair">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="Portrait du curé"
                    className="size-full object-cover"
                    src={photo}
                  />
                ) : (
                  "Aucun portrait"
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-2.5">
                <ChampTexteAdmin
                  isDisabled={inactifCure || !existe(CLES.signature)}
                  label="Signature"
                  maxLength={255}
                  value={signature}
                  onChange={setSignature}
                />
                {peutCure && (
                  <>
                    <BoutonAdmin
                      className="min-h-9 self-start px-3.5 py-[9px] text-[13px]"
                      isPending={portrait.isPending}
                      variante="neutre"
                      onPress={() => entreePortrait.current?.click()}
                    >
                      Changer le portrait
                    </BoutonAdmin>
                    <input
                      ref={entreePortrait}
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      tabIndex={-1}
                      type="file"
                      onChange={(ev) => {
                        const f = ev.target.files?.[0];

                        ev.target.value = "";
                        if (!f) return;
                        if (f.size > 5 * 1024 * 1024) {
                          toast.danger("Le portrait dépasse 5 Mo.");

                          return;
                        }
                        portrait.mutate(f);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <ChampZoneRiche
              compteur
              serif
              isDisabled={inactifCure || !existe(CLES.extrait)}
              label="Extrait affiché sur l’accueil"
              maxLength={220}
              rows={3}
              value={extrait}
              onChange={setExtrait}
            />
            <ChampZoneRiche
              serif
              aide={
                existe(CLES.complet)
                  ? "Affiché sur la page Équipe pastorale."
                  : INDISPONIBLE
              }
              isDisabled={inactifCure || !existe(CLES.complet)}
              label="Message complet"
              rows={8}
              value={complet}
              onChange={setComplet}
            />
          </section>
        </div>
      </ContenuAdmin>
    </>
  );
}
