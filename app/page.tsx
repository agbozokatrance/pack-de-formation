'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    FedaPay: {
      init: (options: {
        public_key: string;
        transaction: { amount: number; description: string; custom_metadata?: Record<string, unknown> };
        customer?: { email?: string; lastname?: string; firstname?: string; phone_number?: { number: string; country: string } };
        currency: { iso: string };
        onComplete: (resp: { reason: string }) => void;
      }) => { open: () => void };
    };
  }
}

/* ─── pixel helper ─── */
function px(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    if (window.fbq) {
      window.fbq('track', event, params);
    } else {
      let attempts = 0;
      const timer = setInterval(() => {
        if (window.fbq) {
          window.fbq('track', event, params);
          clearInterval(timer);
        } else if (++attempts > 30) {
          clearInterval(timer);
        }
      }, 100);
    }
  }
}

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Countdown ─── */
function useCountdown() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let start = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── FAQ ─── */
const faqData = [
  { q: 'Comment vais-je recevoir mes formations après le paiement ?', a: "Dès que votre paiement de 2 500 XOF est validé sur FedaPay, vous êtes automatiquement redirigé vers la page de confirmation et vous recevez un e-mail instantané contenant vos accès directs aux 52 formations." },
  { q: 'Quels sont les modes de paiement acceptés ?', a: 'Vous pouvez payer en toute sécurité via Mobile Money (MTN, Moov, Orange, Wave) ou par carte bancaire grâce à FedaPay.' },
  { q: 'Combien de temps ai-je accès aux formations ?', a: "Votre accès est illimité et à vie. Vous pouvez vous former à votre rythme, quand vous voulez, sans aucune contrainte de temps." },
  { q: 'Est-ce adapté aux débutants ?', a: "Oui, toutes les formations sont conçues pour vous guider pas à pas, du niveau débutant au niveau avancé. Aucune expérience préalable n'est requise." },
  { q: 'Vais-je vraiment recevoir les bonus ?', a: "Oui ! Tous les bonus (100 Livres Audio, 6 000 Ebooks en 3 parties) sont envoyés automatiquement dans votre e-mail de confirmation dès le paiement validé." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-orange-500/20 rounded-xl overflow-hidden glass-card transition-all duration-300">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-orange-500/5 transition-colors" aria-expanded={open}>
        <span className="font-semibold text-white pr-4">{q}</span>
        <span className={`text-orange-400 text-2xl font-light flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}>+</span>
      </button>
      <div className={`faq-content ${open ? 'open' : ''} px-5 pb-5`}>
        <p className="text-gray-300 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Modules ─── */
const modules = [
  { emoji: '🚀', title: 'E-commerce & Dropshipping', desc: 'Importation Chine, Facebook Ads, TikTok Ads, Shopify & Lovable', color: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/30', tag: '8 formations' },
  { emoji: '🤖', title: 'Intelligence Artificielle & Automatisation', desc: 'Mastery ChatGPT, Midjourney, Automation No-Code & workflows IA', color: 'from-purple-500/20 to-blue-500/10', border: 'border-purple-500/30', tag: '10 formations' },
  { emoji: '📣', title: 'Marketing Digital & Conversion', desc: 'Meta Pixel, Funnels de vente haute conversion, WhatsApp Marketing', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', tag: '9 formations' },
  { emoji: '🎨', title: 'Design & Création de Contenu', desc: 'Canva Pro, Montage Vidéo CapCut, Avatars IA & Branding', color: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/30', tag: '7 formations' },
  { emoji: '💻', title: 'Développement Web & No-Code', desc: "Création d'applications avec Bubble, Replit, Supabase & plus", color: 'from-green-500/20 to-emerald-500/10', border: 'border-green-500/30', tag: '12 formations' },
  { emoji: '📈', title: 'Finance & Stratégies de Vente', desc: 'Gestion de business Cash on Delivery, Closing & Scaling', color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30', tag: '6 formations' },
];

/* ─── Bonus ─── */
const bonuses = [
  { emoji: '🎧', title: '100 Livres Audio Premium', desc: "Enrichissez votre esprit et développez votre mindset d'entrepreneur avec 100 livres audio soigneusement sélectionnés.", value: '25 000 XOF', color: 'from-purple-500/20 to-indigo-500/10', border: 'border-purple-500/30' },
  { emoji: '📚', title: '6 000 Ebooks Business & Marketing', desc: "La plus grande bibliothèque digitale : 6 000 ebooks en 3 parties sur le business, le marketing, l'entrepreneuriat et le développement personnel.", value: '50 000 XOF', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
  { emoji: '📂', title: 'App Mega — Accès Cloud', desc: "Téléchargez l'application Mega pour accéder à certaines formations depuis votre mobile, sans complications.", value: 'GRATUIT', color: 'from-red-500/20 to-orange-500/10', border: 'border-red-500/30' },
  { emoji: '🗜️', title: 'WinRAR — Extraction Facile', desc: "Extrayez facilement les formations à téléchargement direct avec WinRAR, disponible sur Android.", value: 'GRATUIT', color: 'from-green-500/20 to-emerald-500/10', border: 'border-green-500/30' },
];

/* ─── Testimonials ─── */
const testimonials = [
  { name: 'Kofi Mensah', country: '🇬🇭 Ghana', text: "En 3 semaines avec le pack, j'ai lancé ma boutique Shopify et généré mes 2 premières ventes. Incroyable !", stars: 5 },
  { name: 'Aminata Traoré', country: '🇨🇮 Côte d\'Ivoire', text: 'Les formations IA ont complètement transformé ma façon de travailler. Je crée maintenant du contenu 3x plus vite.', stars: 5 },
  { name: 'Moussa Diallo', country: '🇸🇳 Sénégal', text: "2 500 XOF pour 52 formations... c'est une blague tellement c'est rentable. J'en ai récupéré 10x en 1 mois.", stars: 5 },
];

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  const { h, m, s } = useCountdown();
  useScrollReveal();

  /* Numéro WhatsApp via variable d'environnement */
  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2290161973836';

  /* Form state */
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  /* Loading state — afficher un spinner immédiatement quand on clique */
  const [isLoading, setIsLoading] = useState(false);

  /* Pixel events on mount */
  useEffect(() => {
    px('PageView');
    px('ViewContent', {
      content_name: 'Pack Ultime 52 Formations',
      content_ids: ['pack-52-formations'],
      content_type: 'product',
      value: 8.50,
      currency: 'USD',
    });
  }, []);

  /* Validate form */
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Votre prénom est requis';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email valide requis';
    if (!form.phone.trim()) errors.phone = 'Votre numéro est requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  /* Open FedaPay checkout */
  const handleCheckout = useCallback(() => {
    if (!formSubmitted) {
      if (!validateForm()) {
        document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      /* Fire Lead event */
      px('Lead', {
        content_name: 'Pack Ultime 52 Formations',
        value: 8.50,
        currency: 'USD',
        email: form.email,
      });
      setFormSubmitted(true);
    }

    /* Fire InitiateCheckout */
    px('InitiateCheckout', {
      content_name: 'Pack Ultime 52 Formations',
      value: 8.50,
      currency: 'USD',
      num_items: 1,
    });

    /* Afficher immédiatement le spinner — l'utilisateur voit que ça charge */
    setIsLoading(true);

    /* Génération d'un eventId unique pour la déduplication Meta Pixel + CAPI */
    const eventId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    /* Si FedaPay n'est pas encore chargé, réessayer toutes les 200ms (max 5 sec) */
    let attempts = 0;
    const tryOpen = () => {
      if (window.FedaPay) {
        setIsLoading(false);
        window.FedaPay.init({
          public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY || 'pk_live_0FA_CQ-5H_85zEZGzM_aVwM1',
          transaction: {
            amount: 2500,
            description: 'Pack Ultime 52 Formations - Accès à Vie',
            custom_metadata: { event_id: eventId },
          },
          customer: {
            email: form.email,
            firstname: form.name.split(' ')[0] || form.name,
            lastname: form.name.split(' ').slice(1).join(' ') || '',
            phone_number: { number: form.phone, country: 'BJ' },
          },
          currency: { iso: 'XOF' },
          onComplete(resp) {
            console.log('FedaPay onComplete response:', resp);
            px('AddPaymentInfo', { value: 2500, currency: 'XOF', content_name: 'Pack Ultime 52 Formations' });

            /* Stocker l'eventId en sessionStorage comme sauvegarde client */
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('meta_event_id', eventId);
              sessionStorage.setItem('meta_amount', '2500');
            }

            /* Appel API backend (envoie l'email + déclenche Meta CAPI serveur) */
            if (form.email) {
              fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: form.email,
                  name: form.name,
                  phone: form.phone,
                  eventId: eventId,
                  amount: 2500,
                }),
              }).catch(console.error);
            }

            setTimeout(() => {
              window.location.href = `/merci?eventId=${encodeURIComponent(eventId)}&amount=2500`;
            }, 300);
          },
        }).open();
      } else if (attempts < 25) {
        attempts++;
        setTimeout(tryOpen, 200);
      } else {
        setIsLoading(false);
        alert('Le système de paiement est lent à charger. Veuillez rafraîchir la page et réessayer.');
      }
    };
    tryOpen();
  }, [form, formSubmitted, validateForm]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      {/* FedaPay charge après que la page soit interactive pour ne pas bloquer l'affichage */}
      <Script
        src="https://cdn.fedapay.com/checkout.js?v=1.1.7"
        strategy="afterInteractive"
        onLoad={() => console.log('✅ FedaPay chargé')}
      />

      <main className="min-h-screen hero-bg text-white font-sans overflow-x-hidden">

        {/* ── URGENCY BAR ── */}
        <div className="urgency-bar py-2 px-4 text-center text-sm font-bold text-white tracking-wide">
          ⚡ OFFRE LIMITÉE — Se termine dans&nbsp;
          <span className="font-mono bg-black/30 px-2 py-0.5 rounded">{pad(h)}:{pad(m)}:{pad(s)}</span>
          &nbsp;— Places très limitées !
        </div>

        {/* ── HERO SECTION ── */}
        <section className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-yellow-400/3 blur-[100px] pointer-events-none" />
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full bg-orange-400/30 animate-float"
                style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i * 0.5}s` }} />
            ))}
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 rounded-full px-5 py-2 mb-6 badge-pulse reveal">
              <span className="text-lg">🔥</span>
              <span className="text-orange-400 font-bold text-sm tracking-widest uppercase">Offre Spéciale — Accès à Vie</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 reveal">
              Maîtrisez les <span className="gradient-text">Compétences</span> les Plus Demandées avec le <span className="gradient-text glow-orange-text">Pack Ultime</span> 52 Formations
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed reveal">
              Développez vos compétences en <strong className="text-orange-400">E-commerce</strong>,{' '}
              <strong className="text-orange-400">Marketing Digital</strong>,{' '}
              <strong className="text-orange-400">Intelligence Artificielle</strong>,{' '}
              <strong className="text-orange-400">Design</strong> et{' '}
              <strong className="text-orange-400">Business en Ligne</strong> grâce à un accès complet et illimité.
            </p>

            {/* Social proof pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 reveal">
              {[
                { icon: '★★★★★', text: '+2 400 entrepreneurs formés' },
                { icon: '🌍', text: 'Toute l\'Afrique' },
                { icon: '⚡', text: 'Accès immédiat' },
              ].map((pill, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm">
                  <span className="text-yellow-400">{pill.icon}</span>
                  <span className="text-gray-300">{pill.text}</span>
                </div>
              ))}
            </div>

            {/* Pricing Box */}
            <div className="inline-block bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/30 rounded-2xl p-6 mb-10 glow-orange reveal">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Prix habituel</p>
                  <p className="price-old text-2xl font-bold text-gray-500">50 000 XOF</p>
                </div>
                <div className="text-4xl text-orange-400">→</div>
                <div className="text-center">
                  <p className="text-sm text-orange-400 font-semibold mb-1">AUJOURD&apos;HUI SEULEMENT</p>
                  <p className="text-5xl font-black text-white">2 500 <span className="text-orange-400 text-3xl">XOF</span></p>
                </div>
                <div className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-full animate-pulse">-95% OFF</div>
              </div>
            </div>

            {/* ── LEAD FORM ── */}
            <div id="lead-form" className="max-w-xl mx-auto bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/30 rounded-2xl p-6 mb-6 reveal">
              <p className="text-center font-bold text-white mb-4 text-lg">
                📝 Remplissez vos informations pour accéder au paiement
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <input
                    id="form-name"
                    type="text"
                    placeholder="Votre prénom et nom *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full bg-white/5 border ${formErrors.name ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                  {formErrors.name && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.name}</p>}
                </div>
                <div>
                  <input
                    id="form-email"
                    type="email"
                    placeholder="Votre adresse e-mail * (vos accès seront envoyés ici)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-white/5 border ${formErrors.email ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                  {formErrors.email && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.email}</p>}
                </div>
                <div>
                  <input
                    id="form-phone"
                    type="tel"
                    placeholder="Votre numéro de téléphone * (ex: 2290123456789)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full bg-white/5 border ${formErrors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-3 reveal">
              <button
                id="cta-hero-btn"
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-shimmer text-white font-black text-lg md:text-xl px-10 py-5 rounded-2xl shadow-2xl transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide disabled:opacity-80 disabled:cursor-wait flex items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-6 h-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Chargement du paiement...
                  </>
                ) : (
                  <>🛒 OBTENIR MES 52 FORMATIONS — 2 500 XOF</>
                )}
              </button>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                🔒 Paiement sécurisé via FedaPay — MTN, Moov, Orange, Wave, Carte Bancaire
              </p>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="max-w-5xl mx-auto px-4 mb-16 reveal">
          <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-orange-500/20">
            <div className="text-center">
              <p className="text-3xl font-black text-orange-400"><AnimatedCounter target={2400} suffix="+" /></p>
              <p className="text-gray-400 text-sm mt-1">Entrepreneurs formés</p>
            </div>
            <div className="w-px h-12 bg-orange-500/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-black text-orange-400"><AnimatedCounter target={52} /></p>
              <p className="text-gray-400 text-sm mt-1">Formations incluses</p>
            </div>
            <div className="w-px h-12 bg-orange-500/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-black text-orange-400"><AnimatedCounter target={6000} suffix="+" /></p>
              <p className="text-gray-400 text-sm mt-1">Ebooks en bonus</p>
            </div>
            <div className="w-px h-12 bg-orange-500/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-black text-orange-400">-<AnimatedCounter target={90} suffix="%" /></p>
              <p className="text-gray-400 text-sm mt-1">De réduction</p>
            </div>
          </div>
        </section>

        {/* ── MODULES ── */}
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <div className="separator mb-12" />
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Ce que contient le <span className="gradient-text">Pack Ultime</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">52 formations par des experts pour vous donner les compétences qui génèrent des résultats concrets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {modules.map((mod, i) => (
              <div key={i} className={`card-hover glass-card bg-gradient-to-br ${mod.color} border ${mod.border} rounded-2xl p-6 reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{mod.emoji}</span>
                  <span className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">{mod.tag}</span>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{mod.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center reveal">
            <div className="inline-block bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/40 rounded-2xl px-8 py-4">
              <p className="text-lg font-bold"><span className="gradient-text text-2xl">+ 46</span> autres formations complètes incluses !</p>
              <p className="text-gray-400 text-sm mt-1">Copywriting · Mindset · Freelance · Impression 3D · Crypto · et bien plus...</p>
            </div>
          </div>
        </section>

        {/* ── BONUS SECTION ── */}
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <div className="separator mb-12" />
          <div className="text-center mb-12 reveal">
            <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 rounded-full px-6 py-2 mb-4">
              <span className="text-yellow-400 font-bold text-sm tracking-widest uppercase">🎁 BONUS EXCLUSIFS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              En plus des formations, vous recevez <span className="gradient-text">des Bonus Incroyables</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Valeur totale des bonus : <span className="text-yellow-400 font-bold">75 000+ XOF</span> — Inclus GRATUITEMENT dans votre pack
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {bonuses.map((bonus, i) => (
              <div key={i} className={`card-hover glass-card bg-gradient-to-br ${bonus.color} border ${bonus.border} rounded-2xl p-6 reveal`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{bonus.emoji}</span>
                  <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">{bonus.value}</span>
                </div>
                <h3 className="font-bold text-xl text-white mb-2">{bonus.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{bonus.desc}</p>
              </div>
            ))}
          </div>
          {/* Bonus total value */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center reveal">
            <p className="text-2xl font-black text-white mb-2">
              Valeur totale du Pack Complet : <span className="gradient-text">125 000+ XOF</span>
            </p>
            <p className="text-gray-400 mb-4">52 formations + 100 livres audio + 6 000 ebooks + applications</p>
              <button
                id="cta-bonus-btn"
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-shimmer text-white font-black text-lg px-10 py-4 rounded-2xl transition-transform hover:scale-105 active:scale-95 uppercase disabled:opacity-80 disabled:cursor-wait flex items-center gap-3 mx-auto"
              >
                {isLoading ? (
                  <><svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Chargement...</>
                ) : (
                  <>🎁 TOUT OBTENIR POUR 2 500 XOF SEULEMENT</>
                )}
              </button>
          </div>
        </section>

        {/* ── AVANTAGES ── */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="separator mb-12" />
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Vos <span className="gradient-text">Garanties</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Accès à Vie & Immédiat', desc: "Dès que votre paiement est validé, vous accédez immédiatement à l'intégralité des 52 formations. À vie. Sans abonnement." },
              { icon: '📱', title: 'Multi-Appareils 24h/7j', desc: "Accessible sur mobile, tablette et ordinateur. Formez-vous n'importe où, n'importe quand, même hors ligne." },
              { icon: '📥', title: 'Ressources Téléchargeables', desc: 'Téléchargement direct des ressources, modèles de travail, templates et outils pratiques inclus dans chaque formation.' },
            ].map((item, i) => (
              <div key={i} className="card-hover glass-card rounded-2xl p-8 text-center border border-orange-500/20 reveal">
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{item.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="separator mb-12" />
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ce que disent nos <span className="gradient-text">Entrepreneurs</span></h2>
            <p className="text-gray-400">+2 400 personnes ont déjà transformé leur vie grâce à ce pack</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card card-hover rounded-2xl p-6 border border-white/10 reveal">
                <div className="flex gap-1 mb-3">{Array.from({ length: t.stars }).map((_, j) => <span key={j} className="text-yellow-400">★</span>)}</div>
                <p className="text-gray-300 mb-4 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-sm font-bold">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA MID ── */}
        <section className="max-w-4xl mx-auto px-4 mb-20 reveal">
          <div className="text-center bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/30 rounded-3xl p-10 md:p-16 glow-orange">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt(e) à <span className="gradient-text">Transformer</span> votre vie ?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg">
              Rejoignez +2 400 entrepreneurs. Pour seulement <strong className="text-orange-400">2 500 XOF</strong>, accédez à 52 formations + 6 000 ebooks + 100 livres audio.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button id="cta-middle-btn" onClick={handleCheckout} disabled={isLoading} className="btn-shimmer text-white font-black text-xl px-12 py-6 rounded-2xl shadow-2xl transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide disabled:opacity-80 disabled:cursor-wait flex items-center gap-3 mx-auto">
                {isLoading ? (
                  <><svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Chargement...</>
                ) : (
                  <>🚀 JE VEUX LE PACK COMPLET — 2 500 XOF</>
                )}
              </button>
              <p className="text-gray-400 text-sm">⏰ Offre valable encore <span className="text-orange-400 font-mono font-bold">{pad(h)}:{pad(m)}:{pad(s)}</span></p>
              <p className="text-gray-500 text-xs">🔒 Paiement sécurisé — Accès immédiat après paiement</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 mb-20">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Questions <span className="gradient-text">Fréquentes</span></h2>
          </div>
          <div className="flex flex-col gap-4">
            {faqData.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="max-w-4xl mx-auto px-4 mb-20 text-center reveal">
          <div className="separator mb-16" />
          <h2 className="text-2xl md:text-4xl font-black mb-6">Une dernière chose...</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Dans 6 mois, vous serez au même endroit — ou vous aurez commencé à bâtir quelque chose de grand. La différence, c&apos;est la décision que vous prenez <strong className="text-orange-400">maintenant</strong>.
          </p>
          <button id="cta-final-btn" onClick={handleCheckout} disabled={isLoading} className="btn-shimmer text-white font-black text-xl px-12 py-6 rounded-2xl shadow-2xl transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide disabled:opacity-80 disabled:cursor-wait flex items-center gap-3 mx-auto">
            {isLoading ? (
              <><svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Chargement...</>
            ) : (
              <>✅ OUI, JE PRENDS LE PACK — 2 500 XOF</>
            )}
          </button>
          <p className="text-gray-500 text-sm mt-4">🔒 Paiement sécurisé · Mobile Money · Carte Bancaire · Accès immédiat</p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
          <p>© 2025 STARRIO Class — Pack Ultime 52 Formations. Tous droits réservés.</p>
          <p className="mt-2 text-xs">Paiement sécurisé via FedaPay 🔒 | Support WhatsApp : +229 01 61 97 38 36</p>
        </footer>

        {/* ── FLOATING WHATSAPP BUTTON ── */}
        <a
          href={`https://wa.me/${WA}?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20le%20Pack%20Ultime%2052%20Formations.`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Besoin d'aide ? Contactez-nous sur WhatsApp"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group border border-green-400/30 backdrop-blur-md"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
          <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="hidden md:inline text-sm font-semibold pr-1">Besoin d&apos;aide ?</span>
        </a>
      </main>
    </>
  );
}
