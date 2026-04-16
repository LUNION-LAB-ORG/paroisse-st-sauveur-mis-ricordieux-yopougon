"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { siteConfig } from "@/config/site";

export const NavbarCommon = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm shadow-sm">
      <header className="mx-auto flex h-[85px] max-w-[1440px] items-center justify-between px-6 lg:px-[100px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/images/logo-paroise.png"
            alt="Logo Paroisse"
            priority
            width={85}
            height={85}
            className="w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] lg:w-[85px] lg:h-[85px] rounded-full object-cover"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-[116px]">
          <nav className="flex items-center gap-[26px]">
            {siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "text-base py-2.5 px-2.5 transition-colors no-underline",
                    isActive
                      ? "text-[#98141f] font-medium"
                      : "text-[#414141] hover:text-[#98141f]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/faire-don"
            className="bg-[#98141f] text-white text-base px-10 py-4 rounded-[10px] hover:bg-[#7a1019] transition-colors w-[190px] h-[55px] flex items-center justify-center font-medium"
          >
            Faire un don
          </Link>
        </div>

        {/* Mobile: CTA + Burger */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            href="/faire-don"
            className="bg-[#98141f] text-white text-sm px-5 py-2.5 rounded-[10px]"
          >
            Faire un don
          </Link>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1.5 p-2"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className={clsx("block h-0.5 w-6 bg-[#414141] transition-transform duration-300", isMenuOpen && "translate-y-2 rotate-45")} />
            <span className={clsx("block h-0.5 w-6 bg-[#414141] transition-opacity duration-300", isMenuOpen && "opacity-0")} />
            <span className={clsx("block h-0.5 w-6 bg-[#414141] transition-transform duration-300", isMenuOpen && "-translate-y-2 -rotate-45")} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-1">
            {siteConfig.navItems.map((item, index) => (
              <li key={`${item.href}-${index}`}>
                <Link
                  href={item.href}
                  className={clsx(
                    "block py-3 text-base",
                    pathname === item.href
                      ? "text-[#98141f] font-semibold"
                      : "text-[#414141]"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
