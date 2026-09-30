"use client";

import type { IAnnonceSaisie } from "@/features/annonce/apis/annonce.api";
import type { IAnnonce } from "@/features/annonce/types/annonce.type";

import { useState } from "react";

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
  useEnregistrerAnnonceMutation,
  useSupprimerAnnonceMutation,
} from "@/features/annonce/queries/annonce-admin.mutation";

const CATEGORIES = ["Liturgie", "Sacrements", "Vie paroissiale", "Chantier"];

type IErreurs = Partial<
  Record<
    | "title"
    | "category"
    | "content"
    | "contact"
    | "visible_from"
    | "visible_until",
    string
  >
>;

export function FicheAnnonce({
  annonce,
  peutEcrire,
  onCree,
  onSupprimee,
}: {
  annonce: IAnnonce | null;
  peutEcrire: boolean;
  onCree: (id: number) => void;
  onSupprimee: () => void;
}) {
  const [titre, setTitre] = useState(annonce?.title ?? "");
  const [categorie, setCategorie] = useState(
    annonce?.category ?? "Vie paroissiale",
  );
  const [texte, setTexte] = useState(annonce?.content ?? "");
  const [contact, setContact] = useState(annonce?.contact ?? "");
  const [du, setDu] = useState(annonce?.visible_from?.slice(0, 10) ?? "");
  const [au, setAu] = useState(annonce?.visible_until?.slice(0, 10) ?? "");
  const [une, setUne] = useState(annonce?.is_featured ?? false);
  const [erreurs, setErreurs] = useState<IErreurs>({});

  const enregistrer = useEnregistrerAnnonceMutation();
  const supprimer = useSupprimerAnnonceMutation();
  const { confirmer, fenetre } = useConfirmation();
  const enCours = enregistrer.isPending || supprimer.isPending;
  const inactif = !peutEcrire || enCours;
  const publiee = annonce?.status === "published";

  const categories =
    CATEGORIES.includes(categorie) || !categorie
      ? CATEGORIES
      : [categorie, ...CATEGORIES];

  const soumettre = (status: IAnnonceSaisie["status"]) => {
    const e: IErreurs = {};

    if (!titre.trim()) e.title = "Indiquez le titre de l’annonce.";
    if (!texte.trim()) e.content = "Saisissez le texte de l’annonce.";
    if (du && au && au < du) e.visible_until = "La fin doit suivre le début.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    enregistrer.mutate(
      {
        id: annonce?.id,
        data: {
          title: titre.trim(),
          category: categorie || "",
          content: texte,
          contact: contact.trim() || null,
          visible_from: du || null,
          visible_until: au || null,
          is_featured: une,
          status,
        },
      },
      {
        onSuccess: (r) => {
          if (!annonce && r?.data?.id) onCree(r.data.id);
        },
        onError: (err) => setErreurs(erreursChamps(err) as IErreurs),
      },
    );
  };

  return (
    <section className="flex flex-col gap-3.5 rounded-admin border border-t-4 border-bord-admin border-t-marine bg-white p-5 md:p-[22px]">
      {fenetre}
      <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
        {annonce
          ? peutEcrire
            ? "Modifier l’annonce"
            : "Annonce"
          : "Nouvelle annonce"}
      </h2>
      <ChampTexteAdmin
        erreur={erreurs.title}
        isDisabled={inactif}
        label="Titre"
        maxLength={255}
        value={titre}
        onChange={setTitre}
      />
      <ChampChoixAdmin
        erreur={erreurs.category}
        isDisabled={inactif}
        label="Catégorie"
        options={categories.map((c) => ({ valeur: c, label: c }))}
        value={categorie}
        onChange={setCategorie}
      />
      <ChampZoneAdmin
        erreur={erreurs.content}
        isDisabled={inactif}
        label="Texte"
        rows={5}
        value={texte}
        onChange={setTexte}
      />
      <ChampTexteAdmin
        erreur={erreurs.contact}
        isDisabled={inactif}
        label="Contact"
        maxLength={255}
        value={contact}
        onChange={setContact}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChampTexteAdmin
          erreur={erreurs.visible_from}
          isDisabled={inactif}
          label="Visible du"
          type="date"
          value={du}
          onChange={setDu}
        />
        <ChampTexteAdmin
          erreur={erreurs.visible_until}
          isDisabled={inactif}
          label="au"
          type="date"
          value={au}
          onChange={setAu}
        />
      </div>
      <CaseAdmin isDisabled={inactif} valeur={une} onChange={setUne}>
        Mettre à la une (en tête de la page Annonces et sur l’accueil)
      </CaseAdmin>
      <div className="flex flex-col gap-1">
        <CaseAdmin isDisabled valeur={false} onChange={() => undefined}>
          Envoyer aux abonnés WhatsApp « Annonces »
        </CaseAdmin>
        <span className="pl-7 text-xs text-gris">
          Disponible dès que WhatsApp Business sera configuré.
        </span>
      </div>
      {peutEcrire && (
        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-bord-admin pt-3.5">
          {annonce && (
            <BoutonAdmin
              className="mr-auto"
              isDisabled={enCours}
              variante="lien"
              onPress={async () => {
                if (
                  await confirmer({
                    titre: "Supprimer cette annonce ?",
                    message: `« ${annonce.title} » sera retirée du site et de la liste.`,
                    libelleConfirmer: "Supprimer",
                    danger: true,
                  })
                )
                  supprimer.mutate(annonce.id, { onSuccess: onSupprimee });
              }}
            >
              Supprimer
            </BoutonAdmin>
          )}
          <BoutonAdmin
            isDisabled={enCours}
            isPending={
              enregistrer.isPending &&
              enregistrer.variables?.data.status !== "published"
            }
            variante="neutre"
            onPress={() => soumettre(publiee ? "hidden" : "draft")}
          >
            {publiee ? "Masquer" : "Enregistrer le brouillon"}
          </BoutonAdmin>
          <BoutonAdmin
            className="px-5"
            isDisabled={enCours}
            isPending={
              enregistrer.isPending &&
              enregistrer.variables?.data.status === "published"
            }
            variante="marine"
            onPress={() => soumettre("published")}
          >
            Publier
          </BoutonAdmin>
        </div>
      )}
    </section>
  );
}
