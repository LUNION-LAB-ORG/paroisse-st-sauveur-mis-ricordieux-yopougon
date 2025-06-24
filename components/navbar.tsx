"use client";

import React from "react";
import Image from "next/image";
import {
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Navbar,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";

export const AcmeLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        className="w-20 h-auto"
        src="/assets/images/logo-paroise.png"
        alt="Logo"
        width={50}
        height={50}
      />
    </Link>
  );
};

export const NavbarCommon = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <Navbar
      isBordered
      className="py-5"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Logo + bouton "Faire un don" visible à gauche sur mobile et tablette */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <AcmeLogo />
        </NavbarBrand>

        {/* Faire un don visible sur mobile/tablette (caché sur lg+) */}
        <div className="lg:hidden ml-2">
          <Link href="/faire-don">
            <Button color="primary" size="sm">
              Faire un don
            </Button>
          </Link>
        </div>
      </NavbarContent>

      {/* Menu burger visible uniquement sur mobile/tablette */}
      <NavbarContent className="lg:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        />
      </NavbarContent>

      {/* Menu horizontal visible uniquement sur desktop */}
      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        {siteConfig.navItems.map((item) => (
          <NavbarItem key={item.href}>
            <Link
              className={clsx(
                linkStyles,
                item.href === "#" && "hover:underline"
              )}
              color="foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Bouton "Faire un don" visible uniquement sur desktop */}
      <NavbarContent className="hidden lg:flex" justify="end">
        <NavbarItem>
          <Link href="/faire-don">
            <Button color="primary">Faire un don</Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Menu mobile/tablette */}
      <NavbarMenu className="pt-16">
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              href={item.href}
              size="lg"
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {/* Ajouter aussi "Faire un don" dans le menu mobile
        <NavbarMenuItem>
          <Link href="/faire-don" onClick={handleLinkClick}>
            <Button color="primary" fullWidth>
              Faire un don
            </Button>
          </Link>
        </NavbarMenuItem> */}
      </NavbarMenu>
    </Navbar>
  );
};
