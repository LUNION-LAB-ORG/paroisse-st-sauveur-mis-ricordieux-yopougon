import type { MetadataRoute } from "next";

const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paroisse-st-sauveur-mis-ricordieux.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/login",
        "/demande-messe/confirmation",
        "/demande-messe/recu",
        "/faire-don/paiement",
      ],
    },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
