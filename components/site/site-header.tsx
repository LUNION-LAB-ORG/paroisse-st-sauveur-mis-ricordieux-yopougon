"use client";

import { Button, Drawer } from "@heroui/react";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LIENS_PRINCIPAUX, MENU_PAROISSE } from "./navigation";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  nom: string;
  devise: string;
  logo: string;
}

function Marque({
  nom,
  devise,
  logo,
  compacte = false,
}: SiteHeaderProps & { compacte?: boolean }) {
  return (
    <Link
      className="flex shrink-0 items-center gap-2.5 whitespace-nowrap no-underline hover:no-underline lg:gap-4"
      href="/"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={`Logo de la ${nom}`}
        className={cn(
          "shrink-0 rounded-full object-cover",
          compacte ? "size-[54px]" : "size-[54px] lg:size-[78px]",
        )}
        src={logo}
      />
      <span className="flex flex-col gap-0.5 lg:gap-1">
        <span className="font-heading text-xs font-extrabold uppercase leading-[1.2] tracking-[.02em] text-marine lg:text-[17px] lg:leading-[1.15]">
          Paroisse Saint Sauveur
          <br />
          Miséricordieux
        </span>
        <span className="text-[11px] font-semibold text-azur lg:text-[13px]">
          {devise}
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader(props: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [tiroirOuvert, setTiroirOuvert] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const fermerMenus = () => {
    setMenuOuvert(false);
    setTiroirOuvert(false);
  };

  // Ferme les menus à chaque navigation
  useEffect(() => {
    setMenuOuvert(false);
    setTiroirOuvert(false);
  }, [pathname]);

  // Ferme le menu « La paroisse » au clic extérieur ou sur Échap
  useEffect(() => {
    if (!menuOuvert) return;
    const surClic = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOuvert(false);
    };
    const surTouche = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOuvert(false);

    document.addEventListener("mousedown", surClic);
    document.addEventListener("keydown", surTouche);

    return () => {
      document.removeEventListener("mousedown", surClic);
      document.removeEventListener("keydown", surTouche);
    };
  }, [menuOuvert]);

  return (
    <>
      <header
        ref={headerRef}
        className="relative z-30 border-b border-ligne bg-white"
      >
        <div
          className={cn(
            CONTENEUR,
            "flex h-[76px] items-center justify-between lg:h-[104px]",
          )}
        >
          <Marque {...props} />

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-5 whitespace-nowrap text-[15px] font-semibold xl:flex large:gap-[34px] large:text-base"
          >
            <button
              aria-controls="menu-paroisse"
              aria-expanded={menuOuvert}
              className="flex min-h-11 items-center gap-1.5 text-encre hover:text-rouge"
              type="button"
              onClick={() => setMenuOuvert((v) => !v)}
            >
              La paroisse
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-3 transition-transform",
                  menuOuvert && "rotate-180",
                )}
                strokeWidth={2.5}
              />
            </button>
            {LIENS_PRINCIPAUX.map((l) => (
              <Link
                key={l.href}
                className="flex min-h-11 items-center text-encre hover:text-rouge hover:no-underline"
                href={l.href}
                onClick={fermerMenus}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            className="hidden shrink-0 whitespace-nowrap rounded-charte bg-rouge px-[22px] py-3.5 text-[15px] font-bold text-white hover:bg-rouge-hover hover:text-white hover:no-underline xl:inline-flex"
            href="/#eglise"
          >
            Faire un don
          </Link>

          <Button
            isIconOnly
            aria-label="Ouvrir le menu"
            className="size-11 min-w-11 rounded-charte border border-ligne bg-white xl:hidden"
            variant="ghost"
            onPress={() => setTiroirOuvert(true)}
          >
            <Menu aria-hidden className="size-5 text-marine" strokeWidth={2} />
          </Button>
        </div>

        {menuOuvert && (
          <div
            className="absolute inset-x-0 top-full hidden border-y border-ligne bg-white xl:block"
            id="menu-paroisse"
          >
            <div
              className={cn(
                CONTENEUR,
                "grid grid-cols-3 gap-x-12 gap-y-[26px] py-9",
              )}
            >
              {MENU_PAROISSE.map((m) => (
                <Link
                  key={m.titre}
                  className="flex flex-col gap-1 border-t border-ligne pt-3.5 text-encre hover:no-underline"
                  href={m.href}
                  onClick={fermerMenus}
                >
                  <span className="font-heading text-[21px] font-semibold text-marine">
                    {m.titre}
                  </span>
                  <span className="text-sm text-gris">{m.description}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      <div aria-hidden className="filet-marque h-[3px] lg:h-1" />

      <Drawer.Backdrop isOpen={tiroirOuvert} onOpenChange={setTiroirOuvert}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="rounded-none bg-white">
            <Drawer.CloseTrigger aria-label="Fermer le menu" />
            <Drawer.Header>
              <Drawer.Heading className="font-heading text-lg font-extrabold uppercase text-marine">
                Menu
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col font-body">
              <span className="pt-2 text-[13px] font-bold text-rouge">
                La paroisse
              </span>
              {MENU_PAROISSE.map((m) => (
                <Link
                  key={m.titre}
                  className="flex min-h-11 items-center border-b border-ligne text-base text-encre"
                  href={m.href}
                  onClick={fermerMenus}
                >
                  {m.titre}
                </Link>
              ))}
              <span className="pt-5 text-[13px] font-bold text-rouge">
                Sur le site
              </span>
              {LIENS_PRINCIPAUX.map((l) => (
                <Link
                  key={l.href}
                  className="flex min-h-11 items-center border-b border-ligne text-base font-semibold text-encre"
                  href={l.href}
                  onClick={fermerMenus}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                className="mt-6 rounded-charte bg-rouge py-[15px] text-center text-[15px] font-bold text-white hover:text-white"
                href="/#eglise"
                onClick={fermerMenus}
              >
                Faire un don
              </Link>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
}
