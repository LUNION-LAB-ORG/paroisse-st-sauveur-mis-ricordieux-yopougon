"use client";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Clock3,
  ChevronRight,
  House,
  Newspaper,
  BookX,
  Church,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2D2D83] text-white w-full pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Section 1 : Horaires */}
          <div>
            <h3 className="font-cinzel text-2xl font-bold mb-4 flex items-center gap-2">
               Horaires
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              La Paroisse Saint Sauveur Miséricordieux est une communauté
              catholique située à Yopougon Millionnaire. Messe tous les jours à
              partir de 6h.
            </p>
          </div>

          {/* Section 2 : Liens rapides */}
          <div>
            <h3 className="font-cinzel text-2xl font-bold mb-4 flex items-center gap-2">
              Liens rapides
            </h3>
            <ul className="space-y-2 text-gray-200 text-sm">
              {[
                { label: "Accueil", href: "/" , icon: House },
                { label: "Actualités", href: "/actualites", icon: Newspaper },
                { label: "Méditations", href: "/meditations", icon: Church },
                { label: "Historique", href: "/historique", icon: BookX },
              ].map(({label, href, icon: Icon}, index) => (
                <li key={index}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 hover:underline hover:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 : Contact */}
          <div>
            <h3 className="font-cinzel text-2xl font-bold mb-4 flex items-center gap-2">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-200">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 text-gray-200" />
                <span>
                  Paroisse Saint Sauveur Miséricordieux,
                  <br />
                  Yopougon Millionnaire
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-200" />
                <span>+225 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-200" />
                <span>contact@saintsauveur.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne en bas */}
        <div className="mt-10 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
          <p>
            © {new Date().getFullYear()} Paroisse Saint Sauveur Miséricordieux.
            Tous droits réservés.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/mentions-legales"
              className="hover:text-primary underline transition"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:text-primary underline transition"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
