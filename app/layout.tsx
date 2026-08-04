import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MetaPixel from '@/components/MetaPixel';

/* ─── Next.js optimized font (zero layout shift, no external request blocking) ─── */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Pack Ultime 52 Formations | Accès à Vie - 2 500 XOF',
  description:
    'Maîtrisez les compétences les plus demandées avec le Pack Ultime 52 Formations. E-commerce, IA, Marketing Digital, Design, Développement Web. Accès à vie pour seulement 2 500 XOF.',
  keywords:
    'formations en ligne, e-commerce, intelligence artificielle, marketing digital, dropshipping, Afrique, XOF, pack formations',
  openGraph: {
    title: 'Pack Ultime 52 Formations | Accès à Vie - 2 500 XOF',
    description:
      'Maîtrisez les compétences les plus demandées. 52 formations complètes pour seulement 2 500 XOF.',
    type: 'website',
    url: 'https://pack-de-formation.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pack Ultime 52 Formations | Accès à Vie - 2 500 XOF',
    description: 'Maîtrisez les compétences les plus demandées. 52 formations complètes pour seulement 2 500 XOF.',
  },
  /* Permet au navigateur de commencer à charger la page immédiatement */
  other: {
    'X-DNS-Prefetch-Control': 'on',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <MetaPixel />
        {/* Préconnexion DNS aux services tiers pour réduire la latence */}
        <link rel="dns-prefetch" href="https://cdn.fedapay.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
