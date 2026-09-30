"use client";

import type {
  IPublicationAdmin,
  IPublicationSaisie,
} from "@/features/publication/apis/publication-admin.api";
import type { IPublicationType } from "@/features/publication/types/publication.type";

import { toast } from "@heroui/react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { LIBELLES_TYPE, statutPublication } from "./liste-publications";

import { ChampZoneRiche } from "@/components/admin/contenus/champ-zone";
import { CaseNative } from "@/components/admin/contenus/champs-compacts";
import { heureActuelle, isoJour } from "@/components/admin/contenus/dates";
import {
  erreursChamps,
  messageErreur,
} from "@/components/admin/contenus/erreur-api";
import {
  EnTeteFil,
  LectureSeule,
} from "@/components/admin/contenus/mise-en-page";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  useEnregistrerPublicationMutation,
  useRetirerPhotoMutation,
} from "@/features/publication/queries/publication-admin.mutation";
import { usePublicationAdminQuery } from "@/features/publication/queries/publication-admin.query";
import { cn } from "@/lib/utils";

const TYPES: { id: IPublicationType; label: string; aide: string }[] = [
  { id: "photo", label: "Album photo", aide: "Une galerie d’images" },
  { id: "video", label: "Vidéo", aide: "Un lien YouTube + texte" },
  { id: "text", label: "Texte", aide: "Article ou témoignage" },
];

const CATEGORIES = [
  "Chantier",
  "Célébration",
  "Jeunesse",
  "Chorale",
  "Charité",
  "Sacrements",
];

const MAX_PHOTO_MO = 5;

/** Identifiant YouTube d'une adresse (watch, youtu.be, embed, shorts). */
const idYoutube = (url: string) =>
  /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/.exec(url)?.[1] ?? null;

type IErreurs = Partial<
  Record<
    "title" | "video_url" | "video_duration" | "published_at" | "gallery",
    string
  >
>;

/** Écran « Nouvelle publication » / modification. */
export function EditeurPublication({ id }: { id?: number }) {
  const peutEcrire = useDroits().peutModifier("publications");
  const fiche = usePublicationAdminQuery(id ?? null);

  if (id && (fiche.isLoading || fiche.isError || !fiche.data)) {
    return (
      <>
        <EnTeteAdmin titre="Publication" />
        <ContenuAdmin>
          {fiche.isError ? (
            <ErreurChargement
              message={`La publication n’a pas pu être chargée. ${messageErreur(fiche.error)}`}
              onReessayer={() => fiche.refetch()}
            />
          ) : (
            <p className="m-0 text-sm text-gris">
              Chargement de la publication…
            </p>
          )}
        </ContenuAdmin>
      </>
    );
  }

  return (
    <FormulairePublication
      key={fiche.data ? fiche.data.id : "nouvelle"}
      peutEcrire={peutEcrire}
      publication={fiche.data ?? null}
    />
  );
}

function FormulairePublication({
  publication: p,
  peutEcrire,
}: {
  publication: IPublicationAdmin | null;
  peutEcrire: boolean;
}) {
  const router = useRouter();
  const [type, setType] = useState<IPublicationType>(p?.type ?? "photo");
  const [titre, setTitre] = useState(p?.title ?? "");
  const [chapeau, setChapeau] = useState(p?.lead ?? "");
  const [citation, setCitation] = useState(p?.quote ?? "");
  const [video, setVideo] = useState(p?.video_url ?? "");
  const [duree, setDuree] = useState(p?.video_duration ?? "");
  const [corps, setCorps] = useState(p?.body ?? "");
  const [categorie, setCategorie] = useState(p?.category ?? "");
  const [date, setDate] = useState(p?.published_at?.slice(0, 10) ?? isoJour());
  const [une, setUne] = useState(p?.is_featured ?? false);
  const [commentaires, setCommentaires] = useState(p?.allow_comments ?? true);
  const [jaime, setJaime] = useState(p?.show_likes ?? true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [erreurs, setErreurs] = useState<IErreurs>({});
  const [brouillonEnregistre, setBrouillonEnregistre] = useState(false);
  const entree = useRef<HTMLInputElement>(null);

  const enregistrer = useEnregistrerPublicationMutation();
  const retirerPhoto = useRetirerPhotoMutation();
  const { confirmer, fenetre } = useConfirmation();
  const enCours = enregistrer.isPending || retirerPhoto.isPending;
  const inactif = !peutEcrire || enCours;

  const apercusPhotos = useMemo(
    () => photos.map((f) => URL.createObjectURL(f)),
    [photos],
  );

  useEffect(
    () => () => apercusPhotos.forEach((u) => URL.revokeObjectURL(u)),
    [apercusPhotos],
  );

  const galerie = p?.gallery ?? [];
  const nbPhotos = galerie.length + photos.length;
  const youtube = idYoutube(video);
  const publiee = p?.status === "published";
  const statut = p ? statutPublication(p) : null;
  const libelleType = TYPES.find((t) => t.id === type)?.label ?? "";
  const couverture = p?.cover ?? galerie[0] ?? apercusPhotos[0] ?? null;
  const categories =
    categorie && !CATEGORIES.includes(categorie)
      ? [categorie, ...CATEGORIES]
      : CATEGORIES;

  const ajouterPhotos = (liste: FileList | null) => {
    const fichiers = Array.from(liste ?? []);
    const trop = fichiers.find((f) => f.size > MAX_PHOTO_MO * 1024 * 1024);

    if (trop) toast.danger(`« ${trop.name} » dépasse ${MAX_PHOTO_MO} Mo.`);
    setPhotos((l) => [
      ...l,
      ...fichiers.filter(
        (f) =>
          f.size <= MAX_PHOTO_MO * 1024 * 1024 && f.type.startsWith("image/"),
      ),
    ]);
  };

  const soumettre = (status: IPublicationSaisie["status"]) => {
    const r: IErreurs = {};

    if (!titre.trim()) r.title = "Indiquez le titre de la publication.";
    if (type === "video") {
      if (!video.trim()) r.video_url = "Collez le lien de la vidéo YouTube.";
      else if (!youtube)
        r.video_url = "Ce lien ne ressemble pas à une vidéo YouTube.";
      if (duree && !/^\d{1,2}(:\d{2}){1,2}$/.test(duree.trim()))
        r.video_duration = "Format attendu : 4:32";
    }
    if (type === "photo" && status === "published" && nbPhotos === 0)
      r.gallery = "Ajoutez au moins une photo avant de publier l’album.";
    if (!date) r.published_at = "Indiquez la date de publication.";
    setErreurs(r);
    if (Object.keys(r).length) return;

    // Même date qu'avant : on garde l'heure enregistrée ; aujourd'hui : maintenant.
    const publieLe =
      p?.published_at && p.published_at.slice(0, 10) === date
        ? p.published_at
        : date === isoJour()
          ? `${date} ${heureActuelle()}:00`
          : `${date} 00:00:00`;

    const format =
      type === "text"
        ? p?.type === "text" && p.format
          ? p.format
          : "Article"
        : LIBELLES_TYPE[type];

    enregistrer.mutate(
      {
        id: p?.id,
        photos,
        data: {
          type,
          format,
          category: categorie || null,
          title: titre.trim(),
          lead: chapeau.trim() || null,
          body: corps.trim() ? corps : null,
          quote: type === "text" ? citation.trim() || null : (p?.quote ?? null),
          video_url: type === "video" ? video.trim() : (p?.video_url ?? null),
          video_duration:
            type === "video"
              ? duree.trim() || null
              : (p?.video_duration ?? null),
          is_featured: une,
          allow_comments: commentaires,
          show_likes: jaime,
          published_at: publieLe,
          status,
        },
      },
      {
        onSuccess: ({ publication }) => {
          setPhotos([]);
          setBrouillonEnregistre(status === "draft");
          if (!p && publication?.id)
            router.replace(`/dashboard/publications/${publication.id}`);
        },
        onError: (err) => setErreurs(erreursChamps(err) as IErreurs),
      },
    );
  };

  const libelleStatut = brouillonEnregistre
    ? { label: "Brouillon enregistré", couleur: "text-gris" }
    : statut
      ? {
          label: statut.label,
          couleur:
            statut.ton === "succes"
              ? "text-succes"
              : statut.ton === "info"
                ? "text-marine"
                : "text-gris",
        }
      : { label: "Brouillon", couleur: "text-gris" };

  return (
    <>
      {fenetre}
      <EnTeteFil
        actions={
          <>
            <span
              className={cn("text-[13px] font-bold", libelleStatut.couleur)}
            >
              {libelleStatut.label}
            </span>
            {peutEcrire && (
              <>
                <BoutonAdmin
                  isDisabled={enCours}
                  isPending={
                    enregistrer.isPending &&
                    enregistrer.variables?.data.status === "draft"
                  }
                  variante="neutre"
                  onPress={() => soumettre("draft")}
                >
                  Enregistrer le brouillon
                </BoutonAdmin>
                <BoutonAdmin
                  className="px-5"
                  isDisabled={enCours}
                  isPending={
                    enregistrer.isPending &&
                    enregistrer.variables?.data.status === "published"
                  }
                  variante="primaire"
                  onPress={() => soumettre("published")}
                >
                  {publiee ? "Mettre à jour" : "Publier"}
                </BoutonAdmin>
              </>
            )}
          </>
        }
        fil={[
          { label: "Publications", href: "/dashboard/publications" },
          { label: p ? "Modifier la publication" : "Nouvelle publication" },
        ]}
        titre={p ? "Modifier la publication" : "Nouvelle publication"}
      />
      <ContenuAdmin>
        <LectureSeule visible={!peutEcrire} />
        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="flex min-w-0 flex-col gap-4 rounded-admin border border-bord-admin bg-white p-5 md:px-7 md:py-6">
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-sm font-bold">
                Type de publication
              </legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {TYPES.map((t) => {
                  const on = t.id === type;

                  return (
                    <button
                      key={t.id}
                      aria-pressed={on}
                      className={cn(
                        "flex flex-col items-start gap-[3px] rounded-admin p-3.5 text-left text-encre disabled:cursor-not-allowed",
                        on
                          ? "border-2 border-marine bg-selection-admin"
                          : "border border-champ bg-white hover:border-marine",
                      )}
                      disabled={inactif}
                      type="button"
                      onClick={() => setType(t.id)}
                    >
                      <span className="text-[15px] font-bold">{t.label}</span>
                      <span className="text-xs text-gris">{t.aide}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <ChampTexteAdmin
              erreur={erreurs.title}
              isDisabled={inactif}
              label="Titre"
              maxLength={255}
              value={titre}
              onChange={setTitre}
            />
            <ChampZoneRiche
              isDisabled={inactif}
              label={
                <>
                  Chapeau{" "}
                  <span className="font-normal text-gris">
                    (résumé affiché sur la carte)
                  </span>
                </>
              }
              rows={2}
              value={chapeau}
              onChange={setChapeau}
            />

            {type === "photo" && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold">Galerie photo</span>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {galerie.map((src, i) => (
                    <div
                      key={src}
                      className="relative h-[84px] overflow-hidden rounded-admin bg-lin"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={`Galerie, vue ${i + 1}`}
                        className="size-full object-cover"
                        src={src}
                      />
                      {peutEcrire && p && (
                        <button
                          aria-label={`Retirer la photo ${i + 1}`}
                          className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-white/90 text-rouge shadow disabled:opacity-50"
                          disabled={inactif}
                          type="button"
                          onClick={async () => {
                            if (
                              await confirmer({
                                titre: "Retirer cette photo ?",
                                message:
                                  "Elle sera supprimée de la galerie de la publication.",
                                libelleConfirmer: "Retirer",
                                danger: true,
                              })
                            )
                              retirerPhoto.mutate({ id: p.id, index: i });
                          }}
                        >
                          <X aria-hidden className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {apercusPhotos.map((src, i) => (
                    <div
                      key={src}
                      className="relative h-[84px] overflow-hidden rounded-admin bg-lin"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={photos[i]?.name ?? ""}
                        className="size-full object-cover opacity-70"
                        src={src}
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 text-[11px] font-bold text-marine">
                        À envoyer
                      </span>
                      <button
                        aria-label={`Ne pas ajouter ${photos[i]?.name ?? "cette photo"}`}
                        className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-white/90 text-rouge shadow"
                        disabled={inactif}
                        type="button"
                        onClick={() =>
                          setPhotos((l) => l.filter((_, k) => k !== i))
                        }
                      >
                        <X aria-hidden className="size-4" />
                      </button>
                    </div>
                  ))}
                  {peutEcrire && (
                    <button
                      className="col-span-2 flex h-[84px] items-center justify-center rounded-admin border-[1.5px] border-dashed border-champ bg-white text-[13px] font-bold text-marine hover:border-marine disabled:opacity-50"
                      disabled={inactif}
                      type="button"
                      onClick={() => entree.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (!inactif) ajouterPhotos(e.dataTransfer.files);
                      }}
                    >
                      + Ajouter des photos
                    </button>
                  )}
                  <input
                    ref={entree}
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    tabIndex={-1}
                    type="file"
                    onChange={(e) => {
                      ajouterPhotos(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
                {erreurs.gallery ? (
                  <span className="text-[13px] text-rouge">
                    {erreurs.gallery}
                  </span>
                ) : (
                  <span className="text-xs text-gris">
                    {p?.cover
                      ? "La couverture actuelle est conservée. JPG, PNG ou WebP, 5 Mo max. par photo."
                      : "La première photo sert de couverture. JPG, PNG ou WebP, 5 Mo max. par photo."}
                    {photos.length > 0 &&
                      " Les nouvelles photos sont envoyées à l’enregistrement."}
                  </span>
                )}
              </div>
            )}
            {type === "video" && (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[minmax(0,1fr)_140px]">
                <ChampTexteAdmin
                  aide="La miniature est récupérée automatiquement depuis YouTube."
                  erreur={erreurs.video_url}
                  isDisabled={inactif}
                  label="Lien de la vidéo YouTube"
                  placeholder="https://youtube.com/watch?v=…"
                  type="url"
                  value={video}
                  onChange={setVideo}
                />
                <ChampTexteAdmin
                  erreur={erreurs.video_duration}
                  isDisabled={inactif}
                  label="Durée"
                  placeholder="4:32"
                  value={duree}
                  onChange={setDuree}
                />
              </div>
            )}
            {type === "text" && (
              <ChampTexteAdmin
                isDisabled={inactif}
                label="Citation mise en avant"
                value={citation}
                onChange={setCitation}
              />
            )}

            <ChampZoneRiche
              isDisabled={inactif}
              label="Corps du texte"
              outils={["intertitre", "gras", "italique", "citation"]}
              placeholder="Racontez l’événement, citez un témoignage…"
              rows={5}
              value={corps}
              onChange={setCorps}
            />
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
              <ChampChoixAdmin
                isDisabled={inactif}
                label="Catégorie"
                options={categories.map((c) => ({ valeur: c, label: c }))}
                placeholder="Choisir"
                value={categorie}
                onChange={setCategorie}
              />
              <ChampTexteAdmin
                erreur={erreurs.published_at}
                isDisabled={inactif}
                label="Publication le"
                type="date"
                value={date}
                onChange={setDate}
              />
              <CaseNative
                className="font-semibold md:pt-[26px]"
                isDisabled={inactif}
                valeur={une}
                onChange={setUne}
              >
                Mettre à la une
              </CaseNative>
            </div>
          </section>

          <aside className="flex flex-col gap-3 self-start">
            <span className="text-[13px] font-bold text-gris">
              Aperçu sur le site
            </span>
            <div className="overflow-hidden rounded-admin border border-bord-admin bg-white">
              {type === "photo" && (
                <div className="relative flex h-[200px] items-center justify-center bg-lin text-[13px] text-gris-clair">
                  {couverture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                      src={couverture}
                    />
                  ) : (
                    "Aucune photo"
                  )}
                  {nbPhotos > 0 && (
                    <span className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-0.5 text-xs font-bold text-marine">
                      {nbPhotos} photo{nbPhotos > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}
              {type === "video" && (
                <div className="relative flex h-[200px] items-center justify-center bg-marine-deep">
                  {(p?.cover || youtube) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover opacity-60"
                      src={
                        p?.cover ??
                        `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`
                      }
                    />
                  )}
                  <span className="relative flex size-14 items-center justify-center rounded-full bg-white">
                    <svg
                      aria-hidden
                      fill="#2B337E"
                      height="22"
                      viewBox="0 0 24 24"
                      width="22"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              )}
              {type === "text" && (
                <div className="flex h-[200px] items-end bg-marine p-6 font-scripture text-[22px] leading-[1.3] text-white">
                  {citation.trim() ? `« ${citation.trim()} »` : ""}
                </div>
              )}
              <div className="flex flex-col gap-2 p-[18px]">
                <span className="text-xs font-bold text-rouge">
                  {[libelleType, categorie, une ? "À la une" : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span className="font-heading text-lg font-bold leading-[1.3] text-marine">
                  {titre || "Titre de la publication"}
                </span>
                {chapeau && (
                  <span className="text-sm leading-normal text-encre-douce">
                    {chapeau}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-admin border border-bord-admin bg-white p-4 text-sm">
              <span className="font-bold">Interactions</span>
              <CaseNative
                isDisabled={inactif}
                taille={16}
                valeur={commentaires}
                onChange={setCommentaires}
              >
                Autoriser les commentaires (avec modération)
              </CaseNative>
              <CaseNative
                isDisabled={inactif}
                taille={16}
                valeur={jaime}
                onChange={setJaime}
              >
                Afficher les J’aime
              </CaseNative>
              <CaseNative
                isDisabled
                taille={16}
                valeur={false}
                onChange={() => undefined}
              >
                Envoyer aux abonnés WhatsApp
              </CaseNative>
              <span className="pl-6 text-xs text-gris">
                Disponible dès que WhatsApp Business sera configuré.
              </span>
            </div>
          </aside>
        </div>
      </ContenuAdmin>
    </>
  );
}
