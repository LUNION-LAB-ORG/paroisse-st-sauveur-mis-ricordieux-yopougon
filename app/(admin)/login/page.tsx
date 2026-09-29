"use client";

import { Form } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";

import { BoutonAdmin, ChampTexteAdmin } from "@/components/admin/ui/kit";
import { LOGO_PAR_DEFAUT } from "@/lib/charte";

function Connexion() {
  const router = useRouter();
  const recherche = useSearchParams();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreurs, setErreurs] = useState<{
    email?: string;
    motDePasse?: string;
    general?: string;
  }>({});
  const [envoi, setEnvoi] = useState(false);

  // Retour vers la page demandée avant la connexion (uniquement une page du back-office)
  const retour = recherche.get("callbackUrl");
  const destination =
    retour && retour.startsWith("/dashboard") ? retour : "/dashboard";

  const seConnecter = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof erreurs = {};

    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      err.email = "Adresse e-mail invalide.";
    if (!motDePasse) err.motDePasse = "Saisissez votre mot de passe.";
    setErreurs(err);
    if (Object.keys(err).length) return;

    setEnvoi(true);
    const res = await signIn("credentials-user", {
      username: email.trim(),
      password: motDePasse,
      redirect: false,
    });

    if (!res || res.error) {
      setErreurs({
        general:
          "Identifiants incorrects, ou compte désactivé. Contactez l’administrateur si le problème persiste.",
      });
      setEnvoi(false);

      return;
    }
    router.replace(destination);
  };

  return (
    <div className="flex min-h-screen flex-col bg-fond-admin font-body text-encre">
      <div aria-hidden className="filet-marque h-1" />
      <main className="flex grow items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-admin border border-bord-admin border-t-4 border-t-marine bg-white p-8">
          <div className="mb-7 flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Logo de la paroisse Saint Sauveur Miséricordieux"
              className="size-[88px] rounded-full object-cover"
              src={LOGO_PAR_DEFAUT}
            />
            <div className="flex flex-col gap-1">
              <h1 className="m-0 font-heading text-lg font-extrabold uppercase leading-tight text-marine">
                Saint Sauveur
                <br />
                Miséricordieux
              </h1>
              <span className="text-sm text-gris">
                Back-office de la paroisse
              </span>
            </div>
          </div>

          <Form
            className="flex flex-col gap-4"
            validationBehavior="aria"
            onSubmit={seConnecter}
          >
            <ChampTexteAdmin
              autoComplete="username"
              erreur={erreurs.email}
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <ChampTexteAdmin
              autoComplete="current-password"
              erreur={erreurs.motDePasse}
              label="Mot de passe"
              type="password"
              value={motDePasse}
              onChange={setMotDePasse}
            />
            {erreurs.general && (
              <p
                className="m-0 bg-[#FBEAED] px-3 py-2.5 text-sm text-rouge"
                role="alert"
              >
                {erreurs.general}
              </p>
            )}
            <BoutonAdmin
              className="mt-1 w-full"
              isPending={envoi}
              type="submit"
              variante="primaire"
            >
              Se connecter
            </BoutonAdmin>
          </Form>

          <p className="m-0 mt-6 text-center text-[13px] text-gris">
            Mot de passe oublié ? Demandez à l’administrateur de la paroisse de
            le réinitialiser.
          </p>
        </div>
      </main>
      <footer className="pb-6 text-center text-[13px] text-gris">
        <Link className="font-bold text-rouge hover:text-rouge-hover" href="/">
          Retour au site de la paroisse
        </Link>
      </footer>
    </div>
  );
}

export default function PageConnexion() {
  return (
    <Suspense>
      <Connexion />
    </Suspense>
  );
}
