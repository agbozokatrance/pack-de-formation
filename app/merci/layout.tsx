import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merci pour votre achat ! | Pack Ultime 52 Formations',
  description: 'Votre paiement a été confirmé. Vos accès au Pack Ultime 52 Formations ont été envoyés à votre adresse e-mail.',
  robots: 'noindex, nofollow', // Don't index the thank you page
};

export default function MerciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
