import type { Metadata } from "next";

import Link from "next/link";

import { BandeauPage } from "@/components/site/bandeau-page";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { CONTENEUR, lienTelephone } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const DESCRIPTION =
  "Comment la paroisse Saint Sauveur Miséricordieux collecte, utilise et protège vos données personnelles, conformément à la loi ivoirienne n° 2013-450.";

export const metadata: Metadata = {
  title: "Confidentialité et données personnelles",
  description: DESCRIPTION,
  alternates: { canonical: "/confidentialite" },
  openGraph: {
    title: "Politique de confidentialité",
    description: DESCRIPTION,
    type: "article",
    locale: "fr_CI",
  },
};

/** Date de la dernière mise à jour du texte (à modifier à chaque révision). */
const MISE_A_JOUR = "29 septembre 2026";

const TRAITEMENTS = [
  {
    formulaire: "Demande de messe",
    lien: "/demande-messe",
    donnees:
      "Nom et prénom, numéro WhatsApp, e-mail (facultatif), intention et personne pour qui la messe est offerte, date choisie, montant de l’offrande, moyen de paiement.",
    finalite:
      "Célébrer la messe demandée, vous la confirmer, vous envoyer le reçu et, si vous l’avez choisi, un rappel la veille. Une intention marquée « confidentielle » n’est jamais lue à voix haute ni affichée sur la liste du célébrant.",
    duree:
      "3 ans après la dernière messe célébrée, puis archivage comptable des seules données d’offrande (10 ans).",
  },
  {
    formulaire: "Don en ligne",
    lien: "/don",
    donnees:
      "Nom et prénom, téléphone et e-mail (facultatifs), montant, affectation du don, message éventuel, choix de figurer parmi les bienfaiteurs, référence de la transaction Wave.",
    finalite:
      "Encaisser et affecter votre don, vous remercier, établir un reçu et, uniquement si vous l’avez demandé, citer votre nom parmi les bienfaiteurs.",
    duree:
      "10 ans (obligations comptables). Le nom affiché parmi les bienfaiteurs est retiré sur simple demande.",
  },
  {
    formulaire: "Inscription à un événement",
    lien: "/agenda",
    donnees:
      "Nom et prénom, numéro WhatsApp, nombre de personnes, tarif choisi et, pour un événement payant, référence de la transaction.",
    finalite:
      "Organiser l’événement (jauge, accueil), vous envoyer un rappel et vous prévenir d’un changement.",
    duree:
      "1 an après l’événement (10 ans pour les seules données de paiement).",
  },
  {
    formulaire: "Rendez-vous avec un prêtre",
    lien: "/equipe#rdv",
    donnees:
      "Nom et prénom, numéro WhatsApp, motif, prêtre souhaité, message facultatif.",
    finalite:
      "Organiser la rencontre. Le contenu de votre message n’est lu que par le secrétariat et le prêtre concerné ; ce qui est confié en confession n’est jamais consigné.",
    duree: "1 an après le rendez-vous.",
  },
  {
    formulaire: "Commentaires sur les publications",
    lien: "/communaute",
    donnees: "Prénom (ou pseudonyme) et texte du commentaire.",
    finalite:
      "Publier votre commentaire après modération. Les liens et numéros de téléphone saisis sont automatiquement masqués.",
    duree:
      "Tant que la publication est en ligne ; suppression sur simple demande.",
  },
  {
    formulaire: "Abonnement WhatsApp (Parole du jour, annonces)",
    lien: "/parole-du-jour",
    donnees:
      "Numéro WhatsApp, listes choisies, date de votre consentement et, le cas échéant, de votre désabonnement.",
    finalite:
      "Vous envoyer les lectures du jour, l’homélie et les annonces paroissiales. Aucun autre usage.",
    duree:
      "Jusqu’à votre désabonnement, puis 1 an (preuve du consentement et du désabonnement).",
  },
] as const;

const H2 =
  "m-0 font-heading text-[22px] font-extrabold leading-[1.2] text-marine lg:text-[26px]";
const P = "m-0 text-[17px] leading-[1.7] text-[#2C2C36]";

export default async function PageConfidentialite() {
  const settings = await settingServerAPI.obtenirMap();
  const identite = identiteParoisse(settings);
  const horaires = (settings["parish.office_hours"] ?? "").trim();
  const adresse = identite.adresse || "Yopougon Millionnaire, Abidjan";

  const sommaire = [
    ["responsable", "Responsable du traitement"],
    ["traitements", "Données collectées et finalités"],
    ["destinataires", "Destinataires"],
    ["paiement", "Paiement en ligne"],
    ["whatsapp", "Messages WhatsApp"],
    ["audience", "Mesure d’audience, cookies et vidéos"],
    ["securite", "Sécurité"],
    ["droits", "Vos droits"],
  ] as const;

  return (
    <>
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Confidentialité" }]}
        sousTitre={`Protection des données à caractère personnel — loi n° 2013-450 du 19 juin 2013. Dernière mise à jour : ${MISE_A_JOUR}.`}
        titre="Confidentialité et données personnelles"
      />

      <div
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-10 pb-16 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[60px]",
        )}
      >
        <nav
          aria-label="Sommaire"
          className="flex flex-col gap-2 lg:sticky lg:top-6 lg:col-span-3 lg:self-start"
        >
          <span className="text-sm font-bold text-rouge">Sommaire</span>
          <ol className="m-0 flex list-none flex-col border-t border-ligne p-0">
            {sommaire.map(([id, titre]) => (
              <li key={id} className="border-b border-ligne">
                <a
                  className="flex min-h-11 items-center py-2 text-[15px] text-encre hover:text-rouge"
                  href={`#${id}`}
                >
                  {titre}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="flex min-w-0 flex-col gap-12 lg:col-span-8 lg:col-start-5">
          <p className="m-0 text-lg leading-[1.65] text-encre-douce lg:text-xl">
            La paroisse ne collecte que les données nécessaires aux services que
            vous lui demandez. Elles ne sont jamais vendues, louées ni cédées,
            et ne servent à aucune publicité.
          </p>

          <section className="flex scroll-mt-6 flex-col gap-4" id="responsable">
            <h2 className={H2}>1. Responsable du traitement</h2>
            <p className={P}>
              Le responsable du traitement est la{" "}
              <strong>{identite.nom}</strong> ({identite.diocese}), représentée
              par son curé, {adresse}.
            </p>
            <p className={P}>
              Les traitements décrits ci-dessous reposent sur votre consentement
              (abonnement WhatsApp, mention parmi les bienfaiteurs) ou sur la
              réalisation du service que vous demandez (messe, don, inscription,
              rendez-vous). Ils respectent la loi n° 2013-450 du 19 juin 2013
              relative à la protection des données à caractère personnel et sont
              placés sous le contrôle de l’Autorité de Régulation des
              Télécommunications/TIC de Côte d’Ivoire (ARTCI).
            </p>
          </section>

          <section className="flex scroll-mt-6 flex-col gap-5" id="traitements">
            <h2 className={H2}>2. Données collectées, finalités et durées</h2>
            <p className={P}>
              Chaque formulaire du site rappelle, sous le bouton d’envoi, à quoi
              servent les données saisies. En résumé :
            </p>
            <div className="flex flex-col">
              {TRAITEMENTS.map((t) => (
                <div
                  key={t.formulaire}
                  className="flex flex-col gap-3 border-t border-ligne py-6 last:border-b"
                >
                  <h3 className="m-0 font-heading text-lg font-bold text-marine lg:text-xl">
                    <Link
                      className="text-marine hover:text-rouge"
                      href={t.lien}
                    >
                      {t.formulaire}
                    </Link>
                  </h3>
                  <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-2 text-base leading-[1.6] sm:grid-cols-[170px_minmax(0,1fr)]">
                    <dt className="font-semibold text-gris">Données</dt>
                    <dd className="m-0 text-encre-douce">{t.donnees}</dd>
                    <dt className="font-semibold text-gris">Finalité</dt>
                    <dd className="m-0 text-encre-douce">{t.finalite}</dd>
                    <dt className="font-semibold text-gris">Conservation</dt>
                    <dd className="m-0 text-encre-douce">{t.duree}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </section>

          <section
            className="flex scroll-mt-6 flex-col gap-4"
            id="destinataires"
          >
            <h2 className={H2}>3. Destinataires</h2>
            <p className={P}>
              Vos données sont accessibles uniquement aux personnes habilitées
              de la paroisse, selon leur rôle : prêtres, secrétariat,
              trésorerie, équipe de communication (commentaires) et responsables
              de mouvement (leur seul groupe). Chaque accès au back-office est
              nominatif et journalisé.
            </p>
            <p className={P}>
              Prestataires techniques, dans la stricte limite de leur mission :
              l’hébergeur du site, Wave (paiement) et le service d’envoi des
              messages WhatsApp. Aucune donnée n’est transmise à des tiers à des
              fins commerciales.
            </p>
          </section>

          <section className="flex scroll-mt-6 flex-col gap-4" id="paiement">
            <h2 className={H2}>4. Paiement en ligne</h2>
            <p className={P}>
              Les paiements (dons, offrandes de messe, inscriptions) sont
              réalisés sur la plateforme sécurisée de Wave.{" "}
              <strong>
                La paroisse ne reçoit ni ne stocke aucune donnée bancaire ou de
                compte mobile money
              </strong>{" "}
              : seules la référence de la transaction, son montant et son statut
              sont enregistrés, pour la comptabilité et l’envoi du reçu.
            </p>
          </section>

          <section className="flex scroll-mt-6 flex-col gap-4" id="whatsapp">
            <h2 className={H2}>5. Messages WhatsApp</h2>
            <p className={P}>
              Vous ne recevez des messages qu’après avoir coché la case de
              consentement. Pour vous désabonner à tout moment, répondez
              simplement <strong>« STOP »</strong> à l’un de nos messages, ou
              demandez-le au secrétariat. Les rappels liés à une demande (messe,
              événement) ne sont envoyés que si vous les avez acceptés.
            </p>
          </section>

          <section className="flex scroll-mt-6 flex-col gap-4" id="audience">
            <h2 className={H2}>6. Mesure d’audience, cookies et vidéos</h2>
            <p className={P}>
              Le site ne dépose aucun cookie publicitaire ni traceur de réseau
              social. Lorsque la fréquentation du site est mesurée, elle l’est
              de façon agrégée et anonyme, sans cookie publicitaire, dans le
              seul but d’améliorer le site. Un identifiant technique anonyme est
              conservé dans votre navigateur pour éviter les « J’aime » en
              double.
            </p>
            <p className={P}>
              Les vidéos YouTube sont intégrées en mode « confidentialité
              renforcée » (youtube-nocookie.com) et ne se chargent qu’au clic
              sur « Lecture ». La carte d’accès est fournie par Google Maps.
            </p>
          </section>

          <section className="flex scroll-mt-6 flex-col gap-4" id="securite">
            <h2 className={H2}>7. Sécurité</h2>
            <p className={P}>
              Le site est servi exclusivement en HTTPS. L’accès au back-office
              est protégé par mot de passe et limité par rôle ; les intentions
              confidentielles ne sont visibles que du secrétariat et des
              prêtres.
            </p>
          </section>

          <section
            className="flex scroll-mt-6 flex-col gap-4 border-t-4 border-marine bg-white p-6 lg:p-8"
            id="droits"
          >
            <h2 className={H2}>8. Vos droits</h2>
            <p className={P}>
              Vous disposez d’un droit d’accès, de rectification, d’opposition
              et de suppression de vos données, ainsi que du droit de retirer
              votre consentement à tout moment. Pour les exercer, contactez le
              secrétariat paroissial en précisant votre nom et le service
              concerné ; une réponse vous est apportée dans un délai d’un mois.
            </p>
            <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[17px]">
              <li>
                <strong>Adresse :</strong> {identite.nom}, {adresse}
              </li>
              {identite.email && (
                <li className="break-words">
                  <strong>E-mail :</strong>{" "}
                  <a
                    className="font-semibold text-rouge hover:text-rouge-hover"
                    href={`mailto:${identite.email}?subject=${encodeURIComponent("Données personnelles")}`}
                  >
                    {identite.email}
                  </a>
                </li>
              )}
              {identite.telephone && (
                <li>
                  <strong>Téléphone :</strong>{" "}
                  <a
                    className="font-semibold text-rouge hover:text-rouge-hover"
                    href={lienTelephone(identite.telephone)}
                  >
                    {identite.telephone}
                  </a>
                </li>
              )}
              {horaires && (
                <li>
                  <strong>Secrétariat :</strong> {horaires}
                </li>
              )}
            </ul>
            <p className={P}>
              Si vous estimez, après nous avoir contactés, que vos droits ne
              sont pas respectés, vous pouvez saisir l’ARTCI (www.artci.ci).
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
