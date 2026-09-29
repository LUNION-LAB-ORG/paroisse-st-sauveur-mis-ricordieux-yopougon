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
    ];
  },
};

export default nextConfig;
