"use client";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useSettings } from "@/features/setting/hooks/useSettings";

export function Footer() {
  const { settings } = useSettings();

  const name = settings["parish.name"] ?? "Paroisse Saint Sauveur Miséricordieux";
  const description =
    settings["parish.description"] ??
    "La Paroisse Saint Sauveur Miséricordieux est une communauté catholique située à Yopougon Millionnaire.";
  const address = settings["parish.address"] ?? "Yopougon Millionnaire, Abidjan";
  const phone = settings["parish.phone"] ?? "";
  const email = settings["parish.email"] ?? "";

  const facebook = settings["social.facebook"] ?? "";
  const instagram = settings["social.instagram"] ?? "";
  const youtube = settings["social.youtube"] ?? "";
  const whatsapp = settings["social.whatsapp"] ?? "";

  return (
    <footer className="bg-[#2d2d83] text-white w-full py-[74px] px-6 lg:px-[121px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-[120px] items-start">
          {/* À Propos */}
          <div className="w-full md:w-[290px] text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-8">À Propos</h3>
            <p className="text-[#cfcdcd] text-lg leading-relaxed">{description}</p>

            {/* Réseaux sociaux */}
            {(facebook || instagram || youtube || whatsapp) && (
              <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <Facebook className="w-4 h-4 text-white" />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                )}
                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <Youtube className="w-4 h-4 text-white" />
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={whatsapp.startsWith("http") ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
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
              <li>
                <Link href="/programmations" className="hover:text-white transition-colors">
                  Programmations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-[#cfcdcd] text-lg">
              <li>
                <span className="text-white/60">Adresse : </span>
                {address}
              </li>
              {phone && (
                <li>
                  <span className="text-white/60">Téléphone : </span>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <span className="text-white/60">Email : </span>
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#cfcdcd]">
          <p>
            &copy; {new Date().getFullYear()} {name}. Tous droits réservés.
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
