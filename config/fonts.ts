import {
  EB_Garamond as FontScripture,
  Fira_Code as FontMono,
  Montserrat as FontHeading,
  Poppins as FontSans,
  Source_Sans_3 as FontBody,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/* Charte du site public : titres (lettrage du logo), texte courant, textes bibliques */
export const fontHeading = FontHeading({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const fontBody = FontBody({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
});

export const fontScripture = FontScripture({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
});
