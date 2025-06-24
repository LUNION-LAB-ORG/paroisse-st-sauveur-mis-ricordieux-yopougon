"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
import clsx from "clsx";
import { siteConfig } from "@/config/site";

export const AcmeLogo = () => (
  <Link href="/" className="flex items-center gap-3">
    <Image
      src="/assets/images/logo-paroise.png"
      alt="Logo"
      priority
      width={56}  
      height={56}
      className="sm:w-20 h-auto md:w-20 lg:w-20" 
    />
    <span className="font-bold text-lg text-primary hidden sm:inline md:hidden">
      Paroisse Saint Sauveur
    </span>
  </Link>
);


export const NavbarCommon = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <Navbar
      isBordered
      className="py-5 shadow-md bg-white"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Logo + Don mobile */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <AcmeLogo />
        </NavbarBrand>
        <div className="lg:hidden ml-3">
          <Link href="/faire-don">
            <Button
              size="sm"
              color="primary"
              className="rounded-full px-4 text-sm shadow"
            >
              Faire un don
            </Button>
          </Link>
        </div>
      </NavbarContent>

      {/* Burger menu mobile */}
      <NavbarContent className="lg:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        />
      </NavbarContent>

      {/* Desktop nav */}
      <NavbarContent className="hidden lg:flex gap-6" justify="center">
        {siteConfig.navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  "relative font-medium text-md transition-colors duration-300",
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {item.label}
                {/* ligne active */}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary rounded-full transition-all duration-300" />
                )}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Desktop Don */}
      <NavbarContent className="hidden lg:flex" justify="end">
        <NavbarItem>
          <Link href="/faire-don">
            <Button
              color="primary"
              className="rounded-full px-6 py-2 text-md font-semibold shadow-md"
            >
              Faire un don
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="pt-16">
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className={clsx(
                "w-full text-md block py-2 font-medium",
                pathname === item.href ? "text-primary font-semibold" : ""
              )}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        {/* Don button mobile */}
        <NavbarMenuItem>
          <Link href="/faire-don" onClick={handleLinkClick}>
            <Button
              color="primary"
              className="w-full rounded-full mt-4 text-md font-medium"
            >
              Faire un don
            </Button>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
