/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Anciennes adresses remplacées par les pages de la refonte
  async redirects() {
    return [
      { source: "/equipes", destination: "/equipe", permanent: true },
      { source: "/evenement", destination: "/agenda", permanent: true },
      { source: "/evenement/:id", destination: "/agenda/:id", permanent: true },
      // L'inscription se fait sur la fiche de l'événement ; les retours Wave
      // /evenement/:id/inscription/succes|erreur restent en place.
      {
        source: "/evenement/:id/inscription",
        destination: "/agenda/:id",
        permanent: true,
      },
      { source: "/mouvement", destination: "/vie-paroissiale", permanent: true },
      {
        source: "/mouvement/:id",
        destination: "/vie-paroissiale/:id",
        permanent: true,
      },
      { source: "/historique", destination: "/histoire", permanent: true },
      // La query string (?montant=&projet=&bienfaiteur=1) est transmise telle quelle.
      // Les retours Wave /faire-don/paiement/succes|erreur ne sont pas concernés.
      { source: "/faire-don", destination: "/don", permanent: true },
      { source: "/ecoute", destination: "/equipe#rdv", permanent: true },
      { source: "/conseils-paroissiaux", destination: "/equipe", permanent: true },
    ];
  },
};

export default nextConfig;
