import { NextRequest, NextResponse } from 'next/server';
import { createHmac, createHash } from 'crypto';
import { Resend } from 'resend';

const PIXEL_ID = '1191042257432191';
const CAPI_ACCESS_TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN ||
  'EAANpPLXf0CIBSMeUkwmo1bWvaDeZB8oWZBH05uFPNnAZBsESSBjOd7Tbhg1B7EmukpERSIRf0mEAXRZBQw60txGPDsrcsXXhsNnjqZBC5GRfnF5Q5NUyYxaC6mFRWLFAY3sxvxfMBwTuwT0wYJ6bb99SNf9HnzaZB14pai1YUc2beBR7CiSAhEXKGcsvZC0Qd9slAZDZD';

const hash = (v?: string | null) => v ? createHash('sha256').update(v.trim().toLowerCase()).digest('hex') : null;
const normalizePhone = (p?: string | null) => { if (!p) return null; let d = p.replace(/\D/g, ''); if (d.length === 10 && d.startsWith('0')) d = '229' + d.substring(1); return d || null; };

async function sendMetaCapiPurchaseEvent(params: {
  eventId: string; email?: string; phone?: string; name?: string;
  amount?: number; currency?: string; clientIp?: string | null;
  userAgent?: string | null; eventSourceUrl?: string;
}) {
  try {
    const { eventId, email, phone, name, amount = 2500, currency = 'XOF', clientIp, userAgent, eventSourceUrl = 'https://pack-de-formation.vercel.app/merci' } = params;
    const firstName = name ? name.trim().split(' ')[0] : '';
    const lastName = name && name.trim().includes(' ') ? name.trim().split(' ').slice(1).join(' ') : '';
    const userData: Record<string, unknown> = {};
    const hashedEm = hash(email); if (hashedEm) userData.em = [hashedEm];
    const hashedPh = hash(normalizePhone(phone)); if (hashedPh) userData.ph = [hashedPh];
    const hashedFn = hash(firstName); if (hashedFn) userData.fn = [hashedFn];
    const hashedLn = hash(lastName); if (hashedLn) userData.ln = [hashedLn];
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    const payload = { data: [{ event_name: 'Purchase', event_time: Math.floor(Date.now() / 1000), event_id: eventId, event_source_url: eventSourceUrl, action_source: 'website', user_data: userData, custom_data: { value: amount, currency, content_name: 'Pack Ultime 52 Formations', content_ids: ['pack-52-formations'], content_type: 'product', num_items: 1 } }] };
    const res = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CAPI_ACCESS_TOKEN}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    console.log(`✅ CAPI Purchase envoyé ! EventID: ${eventId}`, JSON.stringify(data));
    return data;
  } catch (err) { console.error('Meta CAPI error:', err); return null; }
}

export const dynamic = 'force-dynamic';

/* ─── Vérification signature FedaPay ─── */
function verifyFedaPaySignature(body: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

/* ─── Template Email HTML ─── */
function getEmailHtml(): string {
  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2290161973836';
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Vos Accès - Pack Ultime 52 Formations</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d1a;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B00,#FF8C3A);border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.8);">STARRIO CLASS</p>
              <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;line-height:1.2;">&#x1F389; Félicitations !</h1>
              <p style="margin:12px 0 0 0;font-size:18px;color:rgba(255,255,255,0.9);font-weight:500;">Votre accès au Pack Ultime 52 Formations est confirmé</p>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="background:#12121f;padding:32px;border-left:1px solid rgba(255,107,0,0.2);border-right:1px solid rgba(255,107,0,0.2);">
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:#d1d5db;">
                Votre paiement de <strong style="color:#FF6B00;">2 500 XOF</strong> a bien été reçu. Ci-dessous, retrouvez tous vos accès et ressources exclusives.
              </p>

              <!-- ACCÈS FORMATIONS -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(255,107,0,0.15),rgba(18,18,31,0.9));border:1px solid rgba(255,107,0,0.4);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:800;color:#FF6B00;text-transform:uppercase;">&#x1F4DA; VOICI VOS ACCÈS À LA FORMATION</h2>
                    <p style="margin:0 0 16px 0;color:#d1d5db;font-size:14px;">Cliquez ci-dessous pour accéder immédiatement aux 52 formations :</p>
                    <a href="https://docs.google.com/document/d/1cw2m6CaYnmnF5TgJxTp5UQaO3vA7-2LVjqmvd2kgWKs/edit?usp=drivesdk"
                       style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF8C3A);color:#ffffff;font-weight:800;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:10px;">
                      &#x1F446; ACCÉDER AUX 52 FORMATIONS &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- SÉPARATEUR -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,107,0,0.5),transparent);"></td></tr>
              </table>

              <!-- BONUS -->
              <h2 style="margin:0 0 20px 0;font-size:20px;font-weight:800;color:#FFD166;text-align:center;">&#x1F381; VOS BONUS EXCLUSIFS OFFERTS</h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">&#x1F3A7; 100 LIVRES AUDIO</p>
                  <p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;">Enrichissez votre esprit avec 100 livres audio premium</p>
                  <a href="https://drive.google.com/drive/folders/1lJfDMXzAug0ui0aw9T5asw8J3pGT7V5a" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">&#x1F4C1; Accéder aux 100 Livres Audio &rarr;</a>
                </td></tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">&#x1F4D6; 2 000 EBOOKS &mdash; PARTIE 1</p>
                  <a href="https://drive.google.com/drive/folders/1AoPVKl1zRSYr_S_et0qPtBFYO-IyygMq" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">&#x1F4C1; Accéder à la Partie 1 &rarr;</a>
                </td></tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">&#x1F4D6; 2 000 EBOOKS &mdash; PARTIE 2</p>
                  <a href="https://drive.google.com/drive/folders/1MqmQ-j-nJjMrDbKUBOsDPGev0mHJEOnL" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">&#x1F4C1; Accéder à la Partie 2 &rarr;</a>
                </td></tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:20px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">&#x1F4D6; 2 000 EBOOKS &mdash; PARTIE 3</p>
                  <a href="https://drive.google.com/drive/folders/1KjUked-iQeCbHK-QEuyYRb5V0YvvtbBu" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">&#x1F4C1; Accéder à la Partie 3 &rarr;</a>
                </td></tr>
              </table>

              <!-- APPS REQUISES -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(18,18,31,0.9));border:1px solid rgba(139,92,246,0.3);border-radius:10px;margin-bottom:24px;">
                <tr><td style="padding:20px;">
                  <p style="margin:0 0 12px 0;font-size:15px;font-weight:700;color:#a78bfa;">&#x1F4F1; APPLICATIONS REQUISES</p>
                  <p style="margin:0 0 12px 0;font-size:13px;color:#d1d5db;line-height:1.6;">Téléchargez ces 2 applications pour accéder aux formations sans complications :</p>
                  <p style="margin:0 0 6px 0;font-size:13px;color:#d1d5db;">&#x1F4C2; <strong>Méga</strong> &mdash; pour accéder à certaines formations<br/>
                  <a href="https://play.google.com/store/apps/details?id=mega.privacy.android.app" style="color:#FF8C3A;text-decoration:none;">&rarr; Télécharger Mega sur Android</a></p>
                  <p style="margin:12px 0 0 0;font-size:13px;color:#d1d5db;">&#x1F5DC;&#xFE0F; <strong>WinRAR</strong> &mdash; pour extraire les formations<br/>
                  <a href="https://play.google.com/store/apps/details?id=com.rarlab.rar" style="color:#FF8C3A;text-decoration:none;">&rarr; Télécharger WinRAR sur Android</a></p>
                </td></tr>
              </table>

              <!-- SUPPORT -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.3);border-radius:10px;">
                <tr><td style="padding:16px 20px;text-align:center;">
                  <p style="margin:0 0 8px 0;font-size:14px;color:#d1d5db;">Un problème ? Notre support est disponible :</p>
                  <a href="https://wa.me/${WA}?text=Bonjour%2C%20j%27ai%20achet%C3%A9%20le%20Pack%20Ultime%2052%20Formations%20et%20j%27ai%20besoin%20d%27aide."
                     style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:8px;">
                    &#x1F4AC; Contacter le Support WhatsApp &rarr;
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background:#0a0a14;border-radius:0 0 16px 16px;border:1px solid rgba(255,107,0,0.1);border-top:none;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#4b5563;">&copy; 2025 STARRIO Class &mdash; Pack Ultime 52 Formations</p>
              <p style="margin:6px 0 0;font-size:11px;color:#374151;">Cet e-mail a été envoyé suite à votre achat. Merci pour votre confiance.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/* ─── POST : FedaPay Webhook ─── */
export async function POST(req: NextRequest) {
  try {
    /* 1. Lire le corps brut pour vérifier la signature */
    const rawBody = await req.text();

    /* 2. Loguer le webhook reçu */
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
    }

    console.log('FedaPay Webhook reçu:', JSON.stringify(body));

    /* 3. Extraire les données */
    const eventName = (body?.name || body?.event || '') as string;
    const transaction = (body?.data || body?.transaction || body) as Record<string, unknown>;
    const customer = (transaction?.customer || body?.customer || {}) as Record<string, string>;

    const email = customer?.email || (body?.email as string);

    if (!email) {
      console.warn('Webhook: Email client non trouvé dans la requête');
      return NextResponse.json({ received: true, processed: false, reason: 'no_email' });
    }

    /* Envoi de l'événement Meta CAPI Purchase côté serveur */
    const firstname = customer?.firstname || customer?.first_name || '';
    const lastname = customer?.lastname || customer?.last_name || '';
    const fullName = `${firstname} ${lastname}`.trim();
    const phone = (customer?.phone_number as unknown as Record<string, string>)?.number || customer?.phone || '';
    const amount = Number(transaction?.amount) || 2500;
    const customMeta = (transaction?.custom_metadata || {}) as Record<string, string>;
    const eventId = customMeta?.event_id || `tx_fedapay_${transaction?.id || Date.now()}`;

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;

    sendMetaCapiPurchaseEvent({
      eventId,
      email,
      phone,
      name: fullName,
      amount,
      currency: 'XOF',
      clientIp,
      userAgent,
      eventSourceUrl: 'https://pack-de-formation.vercel.app/merci',
    }).catch((err) => console.error('Webhook CAPI error:', err));

    /* 6. Envoyer l'email via Resend */
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Webhook: RESEND_API_KEY non configurée sur Vercel');
      return NextResponse.json({ received: true, processed: false, reason: 'no_api_key' }, { status: 200 });
    }

    const resend = new Resend(apiKey);
    let result = await resend.emails.send({
      from: 'STARRIO Class <contact@starbetpay.com>',
      replyTo: 'aenestostarrio@gmail.com',
      to: [email],
      subject: '✅ Vos accès au Pack Ultime 52 Formations sont prêts !',
      html: getEmailHtml(),
    });

    if (result.error) {
      console.warn('Webhook Resend (starbetpay.com) échec, tentative via secours onboarding@resend.dev:', result.error);
      result = await resend.emails.send({
        from: 'STARRIO Class <onboarding@resend.dev>',
        replyTo: 'aenestostarrio@gmail.com',
        to: [email],
        subject: '✅ Vos accès au Pack Ultime 52 Formations sont prêts !',
        html: getEmailHtml(),
      });
    }

    if (result.error) {
      console.error('Resend — Erreur envoi email:', result.error);
      return NextResponse.json({ received: true, error: result.error }, { status: 200 });
    }

    console.log(`✅ Email envoyé avec succès à ${email} | Resend ID: ${result.data?.id}`);
    return NextResponse.json({ received: true, processed: true, emailSent: true, emailId: result.data?.id });

  } catch (err) {
    console.error('Erreur serveur Webhook:', err);
    return NextResponse.json({ received: true, error: 'server_error' }, { status: 200 });
  }
}

/* ─── GET : Test du endpoint ─── */
export async function GET() {
  return NextResponse.json({
    status: '✅ Webhook FedaPay actif',
    endpoint: 'https://pack-de-formation.vercel.app/api/fedapay-webhook',
    timestamp: new Date().toISOString(),
  });
}
