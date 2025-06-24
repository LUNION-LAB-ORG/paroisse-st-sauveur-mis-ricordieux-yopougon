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

  // Fonction pour fermer le menu après avoir cliqué sur un lien
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      isBordered
      className="py-5"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="ssm:hidden pr-3" justify="start">
        <NavbarBrand>
          <AcmeLogo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className=" hidden sm:flex gap-4" justify="center">
        {/* <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand> */}

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
        {/* <NavbarItem>
        <Link color="foreground" href="#">
          Features
        </Link>
      </NavbarItem> */}
        {/* <NavbarItem isActive>
        <Link aria-current="page" href="#">
          Customers
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="#">
          Integrations
        </Link>
      </NavbarItem> */}
      </NavbarContent>

      <NavbarContent className="" justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/faire-don">
            <Button color="primary" className="p-8">
              Faire un don
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-16">
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              // color={
              //   index === 2
              //     ? "warning"
              //     : index === menuItems.length - 1
              //       ? "danger"
              //       : "foreground"
              // }
              href={item.href}
              size="lg"
              onClick={handleLinkClick} // Ajout du gestionnaire de clic
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
