"use client";

import type {
  IConseil,
  IConseilEnregistrer,
  IMembreConseil,
} from "@/features/conseil/types/conseil.type";

import { toast } from "@heroui/react";
import { useState } from "react";

import {
  EtatEnregistrement,
  LectureSeule,
} from "@/components/admin/demandes/elements";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  Carte,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ChampZoneAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  EtatVide,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  erreursChamps,
  messageErreur,
} from "@/features/admin/utils/reponse-api";
import {
  useConseilsAdminQuery,
  useEnregistrerConseilMutation,
  useReordonnerConseilsMutation,
  useSupprimerConseilMutation,
} from "@/features/conseil/queries/conseil-admin.query";
import {
  lireListeMembres,
  telephoneValide,
} from "@/features/conseil/utils/liste-membres";
import { cn } from "@/lib/utils";

const STATUTS = [
  { valeur: "published", label: "Publié sur le site" },
  { valeur: "draft", label: "Brouillon" },
  { valeur: "hidden", label: "Masqué" },
];

const CHAMP =
  "min-h-10 w-full rounded-admin border border-champ bg-white px-2.5 py-2 text-sm text-encre focus:border-marine focus:outline-none disabled:bg-fond-admin";

const depuis = (c?: IConseil | null): IConseilEnregistrer => ({
  name: c?.name ?? "",
  role: c?.role ?? "",
  leader_title: c?.leader_title ?? "",
  leader_name: c?.leader_name ?? "",
  status: c?.status ?? "published",
  members: (c?.members ?? []).map((m) => ({
    name: m.name,
    function: m.function ?? "",
    phone: m.phone ?? "",
  })),
});

/** Conseils paroissiaux : conseil pastoral, conseil économique… et leurs membres. */
export function EcranConseils() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("equipe") && droits.estAdmin;
  const requete = useConseilsAdminQuery();
  const reordonner = useReordonnerConseilsMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [choisi, setChoisi] = useState<number | "nouveau" | null>(null);
  const [modifie, setModifie] = useState(false);
  const liste = requete.data ?? [];
  const enCreation = choisi === "nouveau";
  const fiche = enCreation
    ? null
    : (liste.find((c) => c.id === choisi) ?? liste[0] ?? null);

  const changer = async (cible: number | "nouveau") => {
    if (
      modifie &&
      !(await confirmer({
        titre: "Abandonner les modifications ?",
        message:
          "Les modifications non enregistrées de ce conseil seront perdues.",
        libelleConfirmer: "Abandonner",
        danger: true,
      }))
    )
      return;
    setModifie(false);
    setChoisi(cible);
  };

  const deplacer = (id: number, sens: -1 | 1) => {
    const i = liste.findIndex((c) => c.id === id);
    const j = i + sens;

    if (i < 0 || j < 0 || j >= liste.length) return;
    const ordre = [...liste];

    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
    reordonner.mutate(ordre);
  };

  return (
    <>
      {fenetre}
      <EnTeteAdmin
        actions={
          peutModifier && (
            <BoutonAdmin variante="primaire" onPress={() => changer("nouveau")}>
              + Ajouter un conseil
            </BoutonAdmin>
          )
        }
        sousTitre="Conseil pastoral, conseil pour les affaires économiques… affichés sur la page Équipe"
        titre="Conseils paroissiaux"
      />
      <ContenuAdmin>
        {!peutModifier && (
          <LectureSeule>
            Consultation seule : seuls les administrateurs modifient les
            conseils.
          </LectureSeule>
        )}
        {requete.isError ? (
          <ErreurChargement
            message="Les conseils n’ont pas pu être chargés."
            onReessayer={() => requete.refetch()}
          />
        ) : requete.isLoading ? (
          <EtatVide>Chargement…</EtatVide>
        ) : (
          <>
            {liste.length === 0 && !enCreation ? (
              <Carte>
                <EtatVide>
                  Aucun conseil pour l’instant. Ajoutez le conseil pastoral et
                  le conseil pour les affaires économiques.
                </EtatVide>
              </Carte>
            ) : (
              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
                {liste.map((c, i) => {
                  const actif = !enCreation && c.id === fiche?.id;

                  return (
                    <li key={c.id}>
                      <button
                        aria-current={actif || undefined}
                        className={cn(
                          "flex w-full flex-col gap-1 rounded-admin bg-white px-4 py-3.5 text-left",
                          actif
                            ? "border-2 border-marine"
                            : "border border-bord-admin hover:border-champ",
                          c.status !== "published" && "opacity-60",
                        )}
                        type="button"
                        onClick={() => changer(c.id)}
                      >
                        <span className="font-heading text-[15px] font-extrabold text-marine">
                          {c.name}
                        </span>
                        <span className="text-xs text-gris">
                          Position {i + 1} · {c.members?.length ?? 0} membre
                          {(c.members?.length ?? 0) > 1 ? "s" : ""} ·{" "}
                          {c.status === "published"
                            ? "visible"
                            : c.status === "draft"
                              ? "brouillon"
                              : "masqué"}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {enCreation && (
                  <li>
                    <div className="flex w-full flex-col gap-1 rounded-admin border-2 border-marine bg-white px-4 py-3.5 opacity-60">
                      <span className="font-heading text-[15px] font-extrabold text-marine">
                        Nouveau conseil
                      </span>
                      <span className="text-xs text-gris">Non enregistré</span>
                    </div>
                  </li>
                )}
              </ul>
            )}
            {(fiche || enCreation) && (
              <FicheConseil
                key={enCreation ? "nouveau" : fiche!.id}
                conseil={fiche}
                index={fiche ? liste.findIndex((c) => c.id === fiche.id) : -1}
                nombre={liste.length}
                ordreEnCours={reordonner.isPending}
                peutModifier={peutModifier}
                onCree={(id) => {
                  setModifie(false);
                  setChoisi(id);
                }}
                onDeplacer={(s) => fiche && deplacer(fiche.id, s)}
                onModifie={setModifie}
                onSupprime={() => {
                  setModifie(false);
                  setChoisi(null);
                }}
              />
            )}
          </>
        )}
      </ContenuAdmin>
    </>
  );
}

function FicheConseil({
  conseil,
  index,
  nombre,
  peutModifier,
  ordreEnCours,
  onModifie,
  onCree,
  onSupprime,
  onDeplacer,
}: {
  conseil: IConseil | null;
  index: number;
  nombre: number;
  peutModifier: boolean;
  ordreEnCours: boolean;
  onModifie: (m: boolean) => void;
  onCree: (id: number) => void;
  onSupprime: () => void;
  onDeplacer: (sens: -1 | 1) => void;
}) {
  const [f, setF] = useState<IConseilEnregistrer>(() => depuis(conseil));
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [etat, setEtat] = useState<"propre" | "modifie" | "enregistre">(
    "propre",
  );
  const [collage, setCollage] = useState<string | null>(null);
  const enregistrer = useEnregistrerConseilMutation();
  const supprimer = useSupprimerConseilMutation();
  const { confirmer, fenetre } = useConfirmation();
  const inactif = !peutModifier;

  const toucher = () => {
    setEtat("modifie");
    onModifie(true);
  };
  const maj = <K extends keyof IConseilEnregistrer>(
    k: K,
    v: IConseilEnregistrer[K],
  ) => {
    setF((p) => ({ ...p, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "" }));
    toucher();
  };
  const majMembres = (membres: IMembreConseil[]) => {
    setF((p) => ({ ...p, members: membres }));
    setErreurs((e) => ({ ...e, members: "" }));
    toucher();
  };
  const majMembre = (i: number, cle: keyof IMembreConseil, v: string) =>
    majMembres(f.members.map((m, j) => (j === i ? { ...m, [cle]: v } : m)));
  const deplacerMembre = (i: number, sens: -1 | 1) => {
    const j = i + sens;

    if (j < 0 || j >= f.members.length) return;
    const l = [...f.members];

    [l[i], l[j]] = [l[j], l[i]];
    majMembres(l);
  };

  const importer = (remplacer: boolean) => {
    const lus = lireListeMembres(collage ?? "");

    if (!lus.length) {
      toast.danger("Aucun membre reconnu dans le texte collé.");

      return;
    }
    majMembres(remplacer ? lus : [...f.members, ...lus]);
    setCollage(null);
    toast.success(
      `${lus.length} membre${lus.length > 1 ? "s" : ""} ${remplacer ? "importés" : "ajoutés"} — pensez à enregistrer.`,
    );
  };

  const valider = () => {
    const e: Record<string, string> = {};

    if (!f.name.trim()) e.name = "Le nom du conseil est obligatoire.";
    if (f.members.some((m) => !m.name.trim()))
      e.members = "Chaque membre doit avoir un nom.";
    else if (f.members.some((m) => !telephoneValide(m.phone)))
      e.members = "Un numéro de téléphone n’est pas valide.";
    setErreurs(e);

    return !Object.keys(e).length;
  };

  const envoyer = () => {
    if (!valider()) return;
    const vide = (v?: string | null) => v?.trim() || null;

    enregistrer.mutate(
      {
        id: conseil?.id ?? null,
        data: {
          name: f.name.trim(),
          role: vide(f.role),
          leader_title: vide(f.leader_title),
          leader_name: vide(f.leader_name),
          status: f.status,
          members: f.members.map((m) => ({
            name: m.name.trim(),
            function: vide(m.function),
            phone: vide(m.phone),
          })),
          ...(conseil ? {} : { sort_order: nombre }),
        },
      },
      {
        onSuccess: (r) => {
          setEtat("enregistre");
          onModifie(false);
          if (!conseil && r?.data?.id) onCree(r.data.id);
        },
        onError: (err) => {
          const champs = erreursChamps(err);

          setErreurs(
            Object.keys(champs).some((k) => k.startsWith("members"))
              ? { ...champs, members: "Vérifiez les membres (nom, téléphone)." }
              : champs,
          );
          toast.danger(messageErreur(err, "L’enregistrement a échoué."));
        },
      },
    );
  };

  const retirer = async () => {
    if (!conseil) return;
    if (
      await confirmer({
        titre: `Supprimer « ${conseil.name} » ?`,
        message:
          "Le conseil et la liste de ses membres ne seront plus affichés sur le site. Pour le retirer temporairement, choisissez plutôt le statut « Masqué ».",
        libelleConfirmer: "Supprimer",
        danger: true,
      })
    )
      supprimer.mutate(conseil.id, { onSuccess: onSupprime });
  };

  return (
    <>
      {fenetre}
      <Carte
        corpsClassName="flex flex-col gap-4 p-5 md:px-7 md:py-6"
        titre="Informations"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ChampTexteAdmin
            erreur={erreurs.name}
            isDisabled={inactif}
            label="Nom du conseil"
            maxLength={150}
            placeholder="Conseil pastoral paroissial"
            value={f.name}
            onChange={(v) => maj("name", v)}
          />
          <ChampChoixAdmin
            isDisabled={inactif}
            label="Statut"
            options={STATUTS}
            value={f.status}
            onChange={(v) => maj("status", v as IConseilEnregistrer["status"])}
          />
        </div>
        <ChampZoneAdmin
          compteur
          isDisabled={inactif}
          label="Rôle du conseil (facultatif)"
          maxLength={255}
          rows={2}
          value={f.role ?? ""}
          onChange={(v) => maj("role", v)}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ChampTexteAdmin
            isDisabled={inactif}
            label="Titre du responsable"
            maxLength={100}
            placeholder="Président"
            value={f.leader_title ?? ""}
            onChange={(v) => maj("leader_title", v)}
          />
          <ChampTexteAdmin
            isDisabled={inactif}
            label="Nom du responsable"
            maxLength={150}
            value={f.leader_name ?? ""}
            onChange={(v) => maj("leader_name", v)}
          />
        </div>
      </Carte>

      <Carte
        action={
          !inactif && (
            <span className="flex flex-wrap gap-2">
              <BoutonAdmin
                className="min-h-9 px-3 py-2"
                variante="neutre"
                onPress={() => setCollage(collage === null ? "" : null)}
              >
                Coller une liste
              </BoutonAdmin>
              <BoutonAdmin
                className="min-h-9 px-3 py-2"
                variante="primaire"
                onPress={() =>
                  majMembres([
                    ...f.members,
                    { name: "", function: "", phone: "" },
                  ])
                }
              >
                + Ajouter un membre
              </BoutonAdmin>
            </span>
          )
        }
        corpsClassName="flex flex-col"
        titre={`Membres (${f.members.length})`}
      >
        {collage !== null && (
          <div className="flex flex-col gap-3 border-b border-bord-admin bg-entete-admin px-5 py-4 md:px-[22px]">
            <ChampZoneAdmin
              aide="Une ligne par membre : Nom ; Fonction ; Téléphone. Un tableau copié depuis Word ou Excel fonctionne aussi."
              label="Liste à importer"
              rows={6}
              value={collage}
              onChange={setCollage}
            />
            <div className="flex flex-wrap justify-end gap-2">
              <BoutonAdmin variante="neutre" onPress={() => setCollage(null)}>
                Annuler
              </BoutonAdmin>
              <BoutonAdmin variante="neutre" onPress={() => importer(false)}>
                Ajouter à la liste
              </BoutonAdmin>
              <BoutonAdmin variante="marine" onPress={() => importer(true)}>
                Remplacer la liste
              </BoutonAdmin>
            </div>
          </div>
        )}
        {erreurs.members && (
          <p
            className="m-0 border-b border-bord-admin px-5 py-2.5 text-[13px] text-rouge md:px-[22px]"
            role="alert"
          >
            {erreurs.members}
          </p>
        )}
        {f.members.length === 0 ? (
          <EtatVide>Aucun membre pour l’instant.</EtatVide>
        ) : (
          <ol className="m-0 flex list-none flex-col p-0">
            {f.members.map((m, i) => (
              <li
                key={i}
                className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-x-2 gap-y-2 border-b border-bord-admin px-5 py-3 last:border-b-0 md:grid-cols-[28px_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-center md:px-[22px]"
              >
                <span className="pt-2.5 text-xs font-bold text-gris md:pt-0">
                  {i + 1}
                </span>
                <input
                  aria-invalid={!m.name.trim() && !!erreurs.members}
                  aria-label={`Nom du membre ${i + 1}`}
                  className={CHAMP}
                  disabled={inactif}
                  maxLength={150}
                  placeholder="Nom et prénoms"
                  value={m.name}
                  onChange={(e) => majMembre(i, "name", e.target.value)}
                />
                <input
                  aria-label={`Fonction du membre ${i + 1}`}
                  className={cn(CHAMP, "col-start-2 md:col-start-auto")}
                  disabled={inactif}
                  maxLength={150}
                  placeholder="Fonction"
                  value={m.function ?? ""}
                  onChange={(e) => majMembre(i, "function", e.target.value)}
                />
                <input
                  aria-invalid={!telephoneValide(m.phone)}
                  aria-label={`Téléphone du membre ${i + 1}`}
                  className={cn(
                    CHAMP,
                    "col-start-2 md:col-start-auto",
                    !telephoneValide(m.phone) && "border-rouge",
                  )}
                  disabled={inactif}
                  inputMode="tel"
                  maxLength={30}
                  placeholder="Téléphone"
                  value={m.phone ?? ""}
                  onChange={(e) => majMembre(i, "phone", e.target.value)}
                />
                {!inactif && (
                  <span className="col-start-2 flex gap-1 md:col-start-auto">
                    <BoutonAdmin
                      aria-label={`Monter ${m.name || `le membre ${i + 1}`}`}
                      className="min-h-9 min-w-9 px-2 py-1.5"
                      isDisabled={i === 0}
                      variante="neutre"
                      onPress={() => deplacerMembre(i, -1)}
                    >
                      ↑
                    </BoutonAdmin>
                    <BoutonAdmin
                      aria-label={`Descendre ${m.name || `le membre ${i + 1}`}`}
                      className="min-h-9 min-w-9 px-2 py-1.5"
                      isDisabled={i === f.members.length - 1}
                      variante="neutre"
                      onPress={() => deplacerMembre(i, 1)}
                    >
                      ↓
                    </BoutonAdmin>
                    <BoutonAdmin
                      aria-label={`Retirer ${m.name || `le membre ${i + 1}`}`}
                      className="min-h-9 px-2.5 py-1.5"
                      variante="neutre"
                      onPress={() =>
                        majMembres(f.members.filter((_, j) => j !== i))
                      }
                    >
                      Retirer
                    </BoutonAdmin>
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
        <p className="m-0 border-t border-bord-admin px-5 py-3 text-[13px] text-gris md:px-[22px]">
          Les numéros de téléphone restent dans le back-office : le site public
          affiche uniquement les noms et fonctions.
        </p>
      </Carte>

      {!inactif && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <BoutonAdmin
              isPending={enregistrer.isPending}
              variante="marine"
              onPress={envoyer}
            >
              {conseil ? "Enregistrer" : "Créer le conseil"}
            </BoutonAdmin>
            {conseil && (
              <>
                <BoutonAdmin
                  isDisabled={index <= 0 || ordreEnCours}
                  variante="neutre"
                  onPress={() => onDeplacer(-1)}
                >
                  Monter
                </BoutonAdmin>
                <BoutonAdmin
                  isDisabled={index >= nombre - 1 || ordreEnCours}
                  variante="neutre"
                  onPress={() => onDeplacer(1)}
                >
                  Descendre
                </BoutonAdmin>
                <BoutonAdmin
                  className="md:ml-auto"
                  isPending={supprimer.isPending}
                  variante="danger"
                  onPress={retirer}
                >
                  Supprimer le conseil
                </BoutonAdmin>
              </>
            )}
          </div>
          <EtatEnregistrement etat={etat} />
        </div>
      )}
    </>
  );
}
