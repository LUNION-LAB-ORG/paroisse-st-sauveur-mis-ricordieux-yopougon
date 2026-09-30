"use client";

import type { IUser } from "@/features/user/types/user.type";

import { toast } from "@heroui/react";
import { useEffect, useState } from "react";

import {
  BoutonAdmin,
  Carte,
  ChampTexteAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  Pastille,
} from "@/components/admin/ui/kit";
import { ZoneDepot } from "@/components/admin/ui/zone-depot";
import { LIBELLES_ROLES, roleConnu } from "@/features/admin/utils/roles";
import { userAPI } from "@/features/user/apis/user.api";

/** Mon profil : coordonnées, photo et mot de passe du compte connecté. */
export default function PageProfil() {
  const [moi, setMoi] = useState<IUser | null>(null);
  const [etat, setEtat] = useState<"chargement" | "pret" | "erreur">(
    "chargement",
  );
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [mdp, setMdp] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState(false);

  const charger = () => {
    setEtat("chargement");
    userAPI
      .obtenirMoi()
      .then((r) => {
        setMoi(r.data);
        setNom(r.data.fullname ?? "");
        setEmail(r.data.email ?? "");
        setTel(r.data.phone ?? "");
        setEtat("pret");
      })
      .catch(() => setEtat("erreur"));
  };

  useEffect(charger, []);
  useEffect(() => {
    if (!photo) return setApercu(null);
    const url = URL.createObjectURL(photo);

    setApercu(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const enregistrer = async () => {
    const e: Record<string, string> = {};

    if (!nom.trim()) e.nom = "Indiquez votre nom.";
    if (!/^\+?\d{8,15}$/.test(tel.replace(/[^\d+]/g, "")))
      e.tel = "Numéro de téléphone invalide.";
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      e.email = "Adresse e-mail invalide.";
    if (mdp && mdp.length < 8) e.mdp = "8 caractères minimum.";
    if (mdp && mdp !== mdp2) e.mdp2 = "Les mots de passe ne correspondent pas.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    setEnvoi(true);
    try {
      const fd = new FormData();

      fd.append("fullname", nom.trim());
      if (email) fd.append("email", email.trim());
      fd.append("phone", tel.replace(/[^\d+]/g, ""));
      if (mdp) fd.append("password", mdp);
      if (photo) fd.append("photo", photo);
      const r = await userAPI.modifierMoi(fd);

      setMoi(r.data);
      setMdp("");
      setMdp2("");
      setPhoto(null);
      toast.success("Profil mis à jour.");
    } catch (err) {
      toast.danger(
        err instanceof Error ? err.message : "L’enregistrement a échoué.",
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <>
      <EnTeteAdmin
        actions={
          etat === "pret" && (
            <BoutonAdmin
              isPending={envoi}
              variante="marine"
              onPress={enregistrer}
            >
              Enregistrer
            </BoutonAdmin>
          )
        }
        sousTitre="Vos coordonnées et votre mot de passe"
        titre="Mon profil"
      />
      <ContenuAdmin>
        {etat === "erreur" && (
          <ErreurChargement
            message="Votre profil n’a pas pu être chargé."
            onReessayer={charger}
          />
        )}
        {etat === "chargement" && (
          <p className="m-0 text-sm text-gris">Chargement…</p>
        )}
        {etat === "pret" && moi && (
          <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[260px_minmax(0,1fr)]">
            <Carte corpsClassName="flex flex-col items-center gap-3 p-6 text-center">
              {}
              {apercu || moi.photo ? (
                <img
                  alt=""
                  className="size-28 rounded-full object-cover"
                  src={apercu ?? moi.photo!}
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-28 items-center justify-center rounded-full bg-[#E3E6F3] font-heading text-3xl font-extrabold text-marine"
                >
                  {(moi.fullname || "?").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="font-heading text-base font-extrabold text-marine">
                {moi.fullname}
              </span>
              <Pastille ton="info">
                {LIBELLES_ROLES[roleConnu(moi.role)]}
              </Pastille>
              <ZoneDepot
                aide="JPG ou PNG"
                className="w-full"
                libelle="Changer la photo"
                onFichiers={(f) => setPhoto(f[0])}
              />
            </Carte>

            <div className="flex flex-col gap-[22px]">
              <Carte
                corpsClassName="grid grid-cols-1 gap-4 p-[22px] sm:grid-cols-2"
                titre="Coordonnées"
              >
                <ChampTexteAdmin
                  className="sm:col-span-2"
                  erreur={erreurs.nom}
                  label="Nom et prénom"
                  value={nom}
                  onChange={setNom}
                />
                <ChampTexteAdmin
                  erreur={erreurs.email}
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <ChampTexteAdmin
                  erreur={erreurs.tel}
                  label="Téléphone"
                  type="tel"
                  value={tel}
                  onChange={setTel}
                />
              </Carte>
              <Carte
                corpsClassName="grid grid-cols-1 gap-4 p-[22px] sm:grid-cols-2"
                titre="Mot de passe"
              >
                <ChampTexteAdmin
                  aide="Laissez vide pour le conserver."
                  autoComplete="new-password"
                  erreur={erreurs.mdp}
                  label="Nouveau mot de passe"
                  type="password"
                  value={mdp}
                  onChange={setMdp}
                />
                <ChampTexteAdmin
                  autoComplete="new-password"
                  erreur={erreurs.mdp2}
                  label="Confirmer le mot de passe"
                  type="password"
                  value={mdp2}
                  onChange={setMdp2}
                />
              </Carte>
            </div>
          </div>
        )}
      </ContenuAdmin>
    </>
  );
}
