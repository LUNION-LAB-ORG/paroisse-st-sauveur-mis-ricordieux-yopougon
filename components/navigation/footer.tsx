"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#2d2d83] text-white w-full py-[74px] px-6 lg:px-[121px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-[120px] items-start">
          {/* À Propos */}
          <div className="w-full md:w-[290px] text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-8">À Propos</h3>
            <p className="text-[#cfcdcd] text-lg leading-relaxed">
              La Paroisse Saint Sauveur Miséricordieux est une communauté
              catholique située à Yopougon Millionnaire.
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-4 text-[#cfcdcd] text-lg">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/mouvement" className="hover:text-white transition-colors">
                  Mouvements
                </Link>
              </li>
              <li>
                <Link href="/meditations" className="hover:text-white transition-colors">
                  Méditations
                </Link>
              </li>
              <li>
                <Link href="/equipes" className="hover:text-white transition-colors">
                  Équipes
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-white transition-colors">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/historique" className="hover:text-white transition-colors">
                  Historique
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-[#cfcdcd] text-lg">
              <li>
                Adresse : Paroisse Saint Sauveur Miséricordieux, Yopougon
                Millionnaire
              </li>
              <li>Téléphone : +225 XX XX XX XX</li>
              <li>Email : contact@saintsauveurmisericordieux.org</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#cfcdcd]">
          <p>
            &copy; {new Date().getFullYear()} Paroisse Saint Sauveur
            Miséricordieux. Tous droits réservés.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="hover:text-white transition underline">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
