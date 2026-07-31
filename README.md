# Pack Ultime 52 Formations — Landing Page

Landing page haute conversion pour le "Pack Ultime 52 Formations" intégrant FedaPay, Meta Pixel et la page de remerciement.

## Stack technique

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **FedaPay Checkout SDK**
- **Meta Pixel (ID: 1191042257432191)**

## Structure des fichiers

```
pack-ultime-52/
├── app/
│   ├── layout.tsx          ← Layout global avec Meta Pixel
│   ├── globals.css         ← Design system, animations, glassmorphism
│   ├── page.tsx            ← 🏠 Landing Page principale
│   └── merci/
│       ├── layout.tsx      ← Layout SEO (noindex)
│       └── page.tsx        ← ✅ Page de remerciement (/merci)
├── components/
│   └── MetaPixel.tsx       ← Composant Meta Pixel base
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Configuration requise avant le lancement

### 1. Clé publique FedaPay
Dans `app/page.tsx`, remplace :
```ts
public_key: 'pk_live_YOUR_FEDAPAY_PUBLIC_KEY',
```
Par ta vraie clé publique FedaPay (disponible dans ton dashboard FedaPay).

### 2. Numéro WhatsApp Support
Dans `app/merci/page.tsx`, remplace :
```ts
href="https://wa.me/22900000000?text=..."
```
Par ton vrai numéro WhatsApp (ex: `https://wa.me/22967000000`)

### 3. URL de partage Facebook
Dans `app/merci/page.tsx`, remplace :
```ts
https://votre-domaine.com
```
Par l'URL réelle de ta landing page.

## Installation & Lancement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) pour la landing page.
Ouvre [http://localhost:3000/merci](http://localhost:3000/merci) pour la page de confirmation.

## Événements Meta Pixel implémentés

| Page | Événement | Déclencheur |
|------|-----------|-------------|
| `/` | `PageView` | Chargement de la page |
| `/` | `ViewContent` | Chargement de la page (produit + valeur) |
| `/` | `InitiateCheckout` | Clic sur bouton de paiement |
| `/merci` | `PageView` | Chargement de la page |
| `/merci` | `Purchase` | Chargement de la page (value: 5000 XOF) |

**Test Event Code:** `TEST85227` — Vérifie dans Meta Events Manager > Test Events.

## Modes de paiement FedaPay

- 📱 MTN Mobile Money
- 📱 Moov Money  
- 📱 Orange Money
- 📱 Wave
- 💳 Carte bancaire (Visa/Mastercard)

## Build production

```bash
npm run build
npm start
```

## Déploiement recommandé

- **Vercel** (recommandé pour Next.js) : `vercel --prod`
- **Netlify** : build command `npm run build`, publish directory `.next`
