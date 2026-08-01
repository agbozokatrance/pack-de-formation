import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { Resend } from 'resend';

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
const EMAIL_CONTENT_HTML = `
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
              <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;line-height:1.2;">🎉 Félicitations !</h1>
              <p style="margin:12px 0 0 0;font-size:18px;color:rgba(255,255,255,0.9);font-weight:500;">Votre accès au Pack Ultime 52 Formations est confirmé</p>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="background:#12121f;padding:32px;border-left:1px solid rgba(255,107,0,0.2);border-right:1px solid rgba(255,107,0,0.2);">
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:#d1d5db;">
                Votre paiement de <strong style="color:#FF6B00;">100 XOF</strong> a bien été reçu. Ci-dessous, retrouvez tous vos accès et ressources exclusives.
              </p>

              <!-- ACCÈS FORMATIONS -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(255,107,0,0.15),rgba(18,18,31,0.9));border:1px solid rgba(255,107,0,0.4);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:800;color:#FF6B00;text-transform:uppercase;">📚 VOICI VOS ACCÈS À LA FORMATION</h2>
                    <p style="margin:0 0 16px 0;color:#d1d5db;font-size:14px;">Cliquez ci-dessous pour accéder immédiatement aux 52 formations :</p>
                    <a href="https://docs.google.com/document/d/1cw2m6CaYnmnF5TgJxTp5UQaO3vA7-2LVjqmvd2kgWKs/edit?usp=drivesdk"
                       style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF8C3A);color:#ffffff;font-weight:800;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:10px;">
                      👆 ACCÉDER AUX 52 FORMATIONS →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- SÉPARATEUR -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,107,0,0.5),transparent);"></td></tr>
              </table>

              <!-- BONUS -->
              <h2 style="margin:0 0 20px 0;font-size:20px;font-weight:800;color:#FFD166;text-align:center;">🎁 VOS BONUS EXCLUSIFS OFFERTS</h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">🎧 100 LIVRES AUDIO</p>
                  <p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;">Enrichissez votre esprit avec 100 livres audio premium</p>
                  <a href="https://drive.google.com/drive/folders/1lJfDMXzAug0ui0aw9T5asw8J3pGT7V5a" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder aux 100 Livres Audio →</a>
                </td></tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">📖 2 000 EBOOKS — PARTIE 1</p>
                  <a href="https://drive.google.com/drive/folders/1AoPVKl1zRSYr_S_et0qPtBFYO-IyygMq" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder à la Partie 1 →</a>
                </td></tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">📖 2 000 EBOOKS — PARTIE 2</p>
                  <a href="https://drive.google.com/drive/folders/1MqmQ-j-nJjMrDbKUBOsDPGev0mHJEOnL" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder à la Partie 2 →</a>
                </td></tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:20px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">📖 2 000 EBOOKS — PARTIE 3</p>
                  <a href="https://drive.google.com/drive/folders/1KjUked-iQeCbHK-QEuyYRb5V0YvvtbBu" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder à la Partie 3 →</a>
                </td></tr>
              </table>

              <!-- APPS REQUISES -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(18,18,31,0.9));border:1px solid rgba(139,92,246,0.3);border-radius:10px;margin-bottom:24px;">
                <tr><td style="padding:20px;">
                  <p style="margin:0 0 12px 0;font-size:15px;font-weight:700;color:#a78bfa;">📱 APPLICATIONS REQUISES</p>
                  <p style="margin:0 0 12px 0;font-size:13px;color:#d1d5db;line-height:1.6;">Téléchargez ces 2 applications pour accéder aux formations sans complications :</p>
                  <p style="margin:0 0 6px 0;font-size:13px;color:#d1d5db;">📂 <strong>Méga</strong> — pour accéder à certaines formations<br/>
                  <a href="https://play.google.com/store/apps/details?id=mega.privacy.android.app" style="color:#FF8C3A;text-decoration:none;">→ Télécharger Mega sur Android</a></p>
                  <p style="margin:12px 0 0 0;font-size:13px;color:#d1d5db;">🗜️ <strong>WinRAR</strong> — pour extraire les formations<br/>
                  <a href="https://play.google.com/store/apps/details?id=com.rarlab.rar" style="color:#FF8C3A;text-decoration:none;">→ Télécharger WinRAR sur Android</a></p>
                </td></tr>
              </table>

              <!-- SUPPORT -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.3);border-radius:10px;">
                <tr><td style="padding:16px 20px;text-align:center;">
                  <p style="margin:0 0 8px 0;font-size:14px;color:#d1d5db;">Un problème ? Notre support est disponible :</p>
                  <a href="https://wa.me/2290146120426?text=Bonjour%2C%20j%27ai%20achet%C3%A9%20le%20Pack%20Ultime%2052%20Formations%20et%20j%27ai%20besoin%20d%27aide."
                     style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:8px;">
                    💬 Contacter le Support WhatsApp →
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background:#0a0a14;border-radius:0 0 16px 16px;border:1px solid rgba(255,107,0,0.1);border-top:none;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#4b5563;">© 2025 STARRIO Class — Pack Ultime 52 Formations</p>
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

/* ─── POST : FedaPay Webhook ─── */
export async function POST(req: NextRequest) {
  try {
    /* 1. Lire le corps brut pour vérifier la signature */
    const rawBody = await req.text();

    /* 2. Vérifier la signature FedaPay (sécurité) */
    const webhookSecret = process.env.FEDAPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get('x-fedapay-signature') || '';
      if (signature && !verifyFedaPaySignature(rawBody, signature, webhookSecret)) {
        console.warn('Webhook: Signature invalide — requête rejetée');
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    /* 3. Parser le JSON */
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
    }

    console.log('FedaPay Webhook reçu:', JSON.stringify(body));

    /* 4. Extraire les données */
    const eventName = (body?.name || body?.event) as string;
    const transaction = (body?.data || body?.transaction) as Record<string, unknown>;

    const isApproved =
      eventName === 'transaction.approved' ||
      (transaction?.status as string) === 'approved';

    if (!isApproved) {
      console.log('Webhook ignoré — statut non approuvé:', eventName);
      return NextResponse.json({ received: true, processed: false, reason: 'not_approved' });
    }

    /* 5. Récupérer l'email du client */
    const customer = transaction?.customer as Record<string, string>;
    const email = customer?.email;

    if (!email) {
      console.warn('Webhook: Email client absent du payload');
      return NextResponse.json({ received: true, processed: false, reason: 'no_email' });
    }

    /* 6. Envoyer l'email via Resend */
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Webhook: RESEND_API_KEY non configurée sur Vercel');
      return NextResponse.json({ received: true, processed: false, reason: 'no_api_key' }, { status: 200 });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'STARRIO Class <contact@starbetpay.com>',
      to: [email],
      subject: '✅ Vos accès au Pack Ultime 52 Formations sont prêts !',
      html: EMAIL_CONTENT_HTML,
    });

    if (error) {
      console.error('Resend — Erreur envoi email:', error);
      return NextResponse.json({ received: true, error }, { status: 200 });
    }

    console.log(`✅ Email envoyé avec succès à ${email} | Resend ID: ${data?.id}`);
    return NextResponse.json({ received: true, processed: true, emailSent: true, emailId: data?.id });

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
