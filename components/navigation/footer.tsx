import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-[#2D2D83] text-secondary w-full  mx-auto pb-6 pt-10">
      <div className="container px-4  max-w-7xl text-lg mx-auto">
        <div className=" grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* horaires */}
          <div>
            <h3 className="font-cinzel text-secondary text-xl lg:text-2xl font-bold mb-4">
              Horaires
            </h3>
            <div className="space-y-2">
              <p>
                La Paroisse Saint Sauveur Miséricordieux est une communauté
                catholique située à Yopougon Millionnaire.
              </p>
            </div>
          </div>
          {/* liens rapides */}
          <div>
            <h3 className="font-cinzel text-secondary text-xl lg:text-2xl font-bold mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className=" w-fit flex items-center hover:underline hover:text-primary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="w-fit flex items-center hover:underline hover:text-primary transition-colors"
                >
                  Actualités
                </Link>
              </li>
              <li>
                <Link
                  href="/meditations"
                  className="w-fit flex items-center hover:underline hover:text-primary transition-colors"
                >
                  Méditations
                </Link>
              </li>
              <li>
                <Link
                  href="/historique"
                  className="w-fit flex items-center hover:underline hover:text-primary transition-colors"
                >
                  Historique
                </Link>
              </li>
            </ul>
          </div>
          {/* contact */}
          <div>
            <h3 className="font-cinzel text-secondary  text-xl lg:text-2xl font-bold mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="lflex items-start">
                <span>Adresse : </span>
                <span className="text-sm">
                  {" "}
                  Paroisse Saint Sauveur Miséricordieux, Yopougon Millionnaire
                </span>
              </div>
              <div className="flex items-center">
                <span>Téléphone : </span>
                <span className="text-sm">+225 XX XX XX XX</span>
              </div>
              <div className="flex items-center flex-wrap">
                <span>Email : </span>
                <span className="text-sm text-wrap">
                  contact@saintsauveur.org
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <Separator className="my-6" /> */}

        {/* <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paroisse Saint Michel. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
