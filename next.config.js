/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* ─── Compression Brotli/Gzip pour réduire la taille des fichiers envoyés ─── */
  compress: true,

  /* ─── Headers de cache pour accélérer les visites répétées ─── */
  async headers() {
    return [
      {
        /* Cache les assets statiques (JS, CSS, images) pendant 1 an */
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        /* Cache les fonts pendant 1 an */
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        /* Page principale : revalidation rapide */
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          /* Sécurité XSS */
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  /* ─── Optimisation des images si jamais vous en ajoutez ─── */
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
