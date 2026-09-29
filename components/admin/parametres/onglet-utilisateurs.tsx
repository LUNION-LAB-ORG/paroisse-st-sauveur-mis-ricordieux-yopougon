"use client";

import type { IUser, IUserRole } from "@/features/user/types/user.type";

import { Modal, toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  BoutonAdmin,
  Carte,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ErreurChargement,
  Pastille,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { LIBELLES_ROLES, type IRole } from "@/features/admin/utils/roles";
import { serviceAPI } from "@/features/service/apis/service.api";
import { userAPI } from "@/features/user/apis/user.api";

const OPTIONS_ROLES = (Object.keys(LIBELLES_ROLES) as IRole[]).map((r) => ({
  valeur: r,
  label: LIBELLES_ROLES[r],
}));
const CLE = ["admin", "utilisateurs"];

interface IFormulaire {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  role: IUserRole;
  service_id: string;
}

const VIDE: IFormulaire = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
  role: "secretariat",
  service_id: "",
};

/** Onglet « Utilisateurs et rôles » (administrateurs uniquement). */
export function OngletUtilisateurs() {
  const { estAdmin } = useDroits();
  const client = useQueryClient();
  const { confirmer, fenetre } = useConfirmation();
  const [invitation, setInvitation] = useState(false);
  const [form, setForm] = useState<IFormulaire>(VIDE);
  const [erreurs, setErreurs] = useState<
    Partial<Record<keyof IFormulaire, string>>
  >({});

  const utilisateurs = useQuery({
    queryKey: CLE,
    queryFn: () => userAPI.obtenirTous({ per_page: "100" }),
    enabled: estAdmin,
  });
  const mouvements = useQuery({
    queryKey: ["admin", "services", "tous"],
    queryFn: () => serviceAPI.obtenirTousAdmin(),
    enabled: estAdmin,
  });

  const modifier = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      userAPI.modifier(id, data as never),
    onSuccess: () => {
      toast.success("Utilisateur mis à jour.");
      void client.invalidateQueries({ queryKey: CLE });
    },
    onError: (e: Error) =>
      toast.danger(e.message || "La modification a échoué."),
  });

  const creer = useMutation({
    mutationFn: (data: IFormulaire) =>
      userAPI.ajouter({
        fullname: data.fullname.trim(),
        email: data.email.trim(),
        phone: data.phone.replace(/[^\d+]/g, ""),
        password: data.password,
        role: data.role,
        status: "active",
        ...(data.role === "movement_leader" && data.service_id
          ? { service_id: Number(data.service_id) }
          : {}),
      }),
    onSuccess: () => {
      toast.success(
        "Utilisateur créé. Communiquez-lui son mot de passe initial.",
      );
      setInvitation(false);
      setForm(VIDE);
      void client.invalidateQueries({ queryKey: CLE });
    },
    onError: (e: Error) => toast.danger(e.message || "La création a échoué."),
  });

  if (!estAdmin) {
    return (
      <p className="m-0 rounded-admin border border-bord-admin bg-white p-6 text-sm text-gris">
        La gestion des utilisateurs est réservée aux administrateurs.
      </p>
    );
  }

  const valider = () => {
    const e: typeof erreurs = {};

    if (!form.fullname.trim()) e.fullname = "Indiquez le nom.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Adresse e-mail invalide.";
    if (!/^\+?\d{8,15}$/.test(form.phone.replace(/[^\d+]/g, "")))
      e.phone = "Numéro de téléphone invalide.";
    if (form.password.length < 8) e.password = "8 caractères minimum.";
    if (form.role === "movement_leader" && !form.service_id)
      e.service_id = "Choisissez le mouvement dont il est responsable.";
    setErreurs(e);
    if (!Object.keys(e).length) creer.mutate(form);
  };

  const basculerStatut = async (u: IUser) => {
    const desactiver = u.status === "active";

    if (
      desactiver &&
      !(await confirmer({
        titre: `Désactiver ${u.fullname} ?`,
        message:
          "Ce compte ne pourra plus se connecter au back-office. Vous pourrez le réactiver à tout moment.",
        libelleConfirmer: "Désactiver",
        danger: true,
      }))
    )
      return;
    modifier.mutate({
      id: u.id,
      data: { status: desactiver ? "inactive" : "active" },
    });
  };

  const liste = utilisateurs.data?.data ?? [];
  const f = (cle: keyof IFormulaire) => (v: string) =>
    setForm((x) => ({ ...x, [cle]: v }));

  return (
    <>
      {utilisateurs.isError && (
        <ErreurChargement onReessayer={() => utilisateurs.refetch()} />
      )}
      <Carte
        action={
          <BoutonAdmin
            className="min-h-10 px-3.5 py-2.5"
            variante="primaire"
            onPress={() => setInvitation(true)}
          >
            + Inviter un utilisateur
          </BoutonAdmin>
        }
        titre="Utilisateurs du back-office"
      >
        <TableauAdmin<IUser>
          chargement={utilisateurs.isLoading}
          cleLigne={(u) => u.id}
          colonnes={[
            {
              cle: "nom",
              titre: "Nom",
              rendu: (u) => <span className="font-bold">{u.fullname}</span>,
            },
            {
              cle: "email",
              titre: "E-mail",
              rendu: (u) => <span className="text-gris">{u.email}</span>,
              secondaire: true,
            },
            {
              cle: "role",
              titre: "Rôle",
              rendu: (u) => (
                <select
                  aria-label={`Rôle de ${u.fullname}`}
                  className="min-h-9 rounded-admin border border-champ bg-white px-2 py-[7px] text-sm"
                  value={u.role ?? "admin"}
                  onChange={(e) =>
                    modifier.mutate({
                      id: u.id,
                      data: { role: e.target.value },
                    })
                  }
                >
                  {OPTIONS_ROLES.map((o) => (
                    <option key={o.valeur} value={o.valeur}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              cle: "dfa",
              titre: "Double authentification",
              rendu: () => (
                <span className="text-[13px] text-gris">Prochainement</span>
              ),
              secondaire: true,
            },
            {
              cle: "statut",
              titre: "Statut",
              rendu: (u) => (
                <button
                  aria-label={
                    u.status === "active"
                      ? `Désactiver ${u.fullname}`
                      : `Réactiver ${u.fullname}`
                  }
                  className="min-h-9"
                  type="button"
                  onClick={() => basculerStatut(u)}
                >
                  <Pastille ton={u.status === "active" ? "succes" : "neutre"}>
                    {u.status === "active" ? "Actif" : "Désactivé"}
                  </Pastille>
                </button>
              ),
            },
          ]}
          lignes={liste}
          vide="Aucun utilisateur."
        />
      </Carte>

      <Modal.Backdrop isOpen={invitation} onOpenChange={setInvitation}>
        <Modal.Container size="md">
          <Modal.Dialog className="rounded-admin">
            <Modal.CloseTrigger aria-label="Fermer" />
            <Modal.Header>
              <Modal.Heading className="font-heading text-lg font-extrabold text-marine">
                Inviter un utilisateur
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <ChampTexteAdmin
                className="sm:col-span-2"
                erreur={erreurs.fullname}
                label="Nom et prénom"
                value={form.fullname}
                onChange={f("fullname")}
              />
              <ChampTexteAdmin
                erreur={erreurs.email}
                label="E-mail"
                type="email"
                value={form.email}
                onChange={f("email")}
              />
              <ChampTexteAdmin
                erreur={erreurs.phone}
                label="Téléphone"
                placeholder="+225"
                type="tel"
                value={form.phone}
                onChange={f("phone")}
              />
              <ChampChoixAdmin
                label="Rôle"
                options={OPTIONS_ROLES}
                value={form.role}
                onChange={(v) =>
                  setForm((x) => ({ ...x, role: v as IUserRole }))
                }
              />
              <ChampTexteAdmin
                aide="À transmettre à la personne ; elle pourra le changer depuis son profil."
                autoComplete="new-password"
                erreur={erreurs.password}
                label="Mot de passe initial"
                type="password"
                value={form.password}
                onChange={f("password")}
              />
              {form.role === "movement_leader" && (
                <ChampChoixAdmin
                  className="sm:col-span-2"
                  erreur={erreurs.service_id}
                  label="Mouvement dont il est responsable"
                  options={(mouvements.data?.data ?? []).map((m) => ({
                    valeur: String(m.id),
                    label: m.title,
                  }))}
                  value={form.service_id}
                  onChange={f("service_id")}
                />
              )}
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-2.5">
              <BoutonAdmin
                variante="neutre"
                onPress={() => setInvitation(false)}
              >
                Annuler
              </BoutonAdmin>
              <BoutonAdmin
                isPending={creer.isPending}
                variante="marine"
                onPress={valider}
              >
                Créer le compte
              </BoutonAdmin>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      {fenetre}
    </>
  );
}
