import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MetaPixel from '@/components/MetaPixel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pack Ultime 52 Formations | Accès à Vie - 5 000 XOF',
  description:
    'Masterisez les compétences les plus demandées avec le Pack Ultime 52 Formations. E-commerce, IA, Marketing Digital, Design, Développement Web. Accès à vie pour seulement 5 000 XOF.',
  keywords:
    'formations en ligne, e-commerce, intelligence artificielle, marketing digital, dropshipping, Afrique, XOF, pack formations',
  openGraph: {
    title: 'Pack Ultime 52 Formations | Accès à Vie - 5 000 XOF',
    description:
      'Maîtrisez les compétences les plus demandées. 52 formations complètes pour seulement 5 000 XOF.',
    type: 'website',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
