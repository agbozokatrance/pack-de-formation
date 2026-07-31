'use client';

import { useEffect } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export default function MerciPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      window.fbq('track', 'Purchase', {
        value: 5000,
        currency: 'XOF',
        content_name: 'Pack Ultime 52 Formations',
        content_ids: ['pack-52-formations'],
        content_type: 'product',
        num_items: 1,
      });
    }
  }, []);

  return (
    <main className="min-h-screen hero-bg flex flex-col items-center justify-center px-4 font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center animate-bounce-slow shadow-[0_0_40px_rgba(74,222,128,0.3)]">
            <span className="text-6xl">✅</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          🎉 Félicitations !<br />
          <span className="text-green-400">Paiement confirmé !</span>
        </h1>

        <div className="glass-card border border-green-500/20 rounded-2xl p-8 mb-8 text-left">
          <p className="text-xl text-gray-200 leading-relaxed mb-6 text-center">
            Vos accès au <strong className="text-orange-400">Pack Ultime 52 Formations</strong> ont été envoyés à votre adresse e-mail.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: '📧', title: 'Vérifiez votre e-mail', desc: 'Un e-mail contenant vos accès vous a été envoyé automatiquement. Vérifiez aussi vos spams si vous ne le voyez pas.' },
              { icon: '📚', title: '52 Formations + Bonus inclus', desc: 'L\'e-mail contient également vos bonus : 100 livres audio, 6 000 ebooks en 3 parties et les liens d\'applications.' },
              { icon: '🔒', title: 'Accès à Vie', desc: 'Votre accès ne expire jamais. Formez-vous à votre rythme, sans aucune limite.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/3 border border-white/10 rounded-xl p-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-white mb-1">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            id="whatsapp-support-btn"
            href="https://wa.me/2290146120426?text=Bonjour%2C%20j%27ai%20effectu%C3%A9%20mon%20paiement%20pour%20le%20Pack%20Ultime%2052%20Formations%20et%20j%27ai%20besoin%20d%27aide."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contacter le Support WhatsApp
          </a>

          <Link
            id="back-home-btn"
            href="/"
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>

        {/* Sharing section */}
        <div className="glass-card border border-orange-500/20 rounded-2xl p-6">
          <p className="text-gray-300 mb-4 font-semibold">🙏 Partagez cette opportunité avec votre entourage !</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent("🔥 J'ai rejoint le Pack Ultime 52 Formations + 6000 Ebooks + 100 Livres Audio pour seulement 5 000 XOF ! Accès à vie. Rejoins-moi ici : https://ton-domaine.com")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              📤 Partager sur WhatsApp
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://ton-domaine.com"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              📘 Partager sur Facebook
            </a>
          </div>
        </div>

        <p className="text-gray-600 text-xs mt-8">
          Si vous ne recevez pas d&apos;e-mail dans les 10 minutes, contactez notre support WhatsApp au +229 01 46 12 04 26.
        </p>
      </div>
    </main>
  );
}
