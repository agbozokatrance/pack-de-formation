import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

/* ─── HTML Email Template ─── */
const EMAIL_CONTENT_HTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Vos Accès - Pack Ultime 52 Formations</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d1a;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B00,#FF8C3A);border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.8);">STARRIO CLASS</p>
              <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;">🎉 Félicitations !</h1>
              <p style="margin:12px 0 0 0;font-size:18px;color:rgba(255,255,255,0.9);">Votre accès au Pack Ultime 52 Formations est confirmé</p>
            </td>
          </tr>
          <tr>
            <td style="background:#12121f;padding:32px;border-left:1px solid rgba(255,107,0,0.2);border-right:1px solid rgba(255,107,0,0.2);">
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:#d1d5db;">
                Votre paiement de <strong style="color:#FF6B00;">5 000 XOF</strong> a bien été reçu. Retrouvez ci-dessous tous vos accès.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(255,107,0,0.15),rgba(18,18,31,0.9));border:1px solid rgba(255,107,0,0.4);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:800;color:#FF6B00;">📚 VOICI VOS ACCÈS À LA FORMATION</h2>
                    <a href="https://docs.google.com/document/d/1cw2m6CaYnmnF5TgJxTp5UQaO3vA7-2LVjqmvd2kgWKs/edit?usp=drivesdk"
                       style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF8C3A);color:#ffffff;font-weight:800;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:10px;">
                      👆 ACCÉDER AUX 52 FORMATIONS →
                    </a>
                  </td>
                </tr>
              </table>
              <h2 style="margin:0 0 20px 0;font-size:20px;font-weight:800;color:#FFD166;text-align:center;">🎁 VOS BONUS EXCLUSIFS OFFERTS</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">🎧 100 LIVRES AUDIO</p><a href="https://drive.google.com/drive/folders/1lJfDMXzAug0ui0aw9T5asw8J3pGT7V5a" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder aux 100 Livres Audio →</a></td></tr></table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">📖 2 000 EBOOKS — PARTIE 1</p><a href="https://drive.google.com/drive/folders/1AoPVKl1zRSYr_S_et0qPtBFYO-IyygMq" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder à la Partie 1 →</a></td></tr></table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:12px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">📖 2 000 EBOOKS — PARTIE 2</p><a href="https://drive.google.com/drive/folders/1MqmQ-j-nJjMrDbKUBOsDPGev0mHJEOnL" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder à la Partie 2 →</a></td></tr></table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:20px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:#ffffff;">📖 2 000 EBOOKS — PARTIE 3</p><a href="https://drive.google.com/drive/folders/1KjUked-iQeCbHK-QEuyYRb5V0YvvtbBu" style="color:#FF8C3A;font-size:13px;font-weight:600;text-decoration:none;">📁 Accéder à la Partie 3 →</a></td></tr></table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(18,18,31,0.9));border:1px solid rgba(139,92,246,0.3);border-radius:10px;margin-bottom:24px;"><tr><td style="padding:20px;"><p style="margin:0 0 12px 0;font-size:15px;font-weight:700;color:#a78bfa;">📱 APPLICATIONS REQUISES</p><p style="margin:0 0 6px 0;font-size:13px;color:#d1d5db;">📂 <strong>Méga</strong> — <a href="https://play.google.com/store/apps/details?id=mega.privacy.android.app" style="color:#FF8C3A;text-decoration:none;">Télécharger →</a></p><p style="margin:0;font-size:13px;color:#d1d5db;">🗜️ <strong>WinRAR</strong> — <a href="https://play.google.com/store/apps/details?id=com.rarlab.rar" style="color:#FF8C3A;text-decoration:none;">Télécharger →</a></p></td></tr></table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.3);border-radius:10px;"><tr><td style="padding:16px 20px;text-align:center;"><a href="https://wa.me/2290146120426" style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:8px;">💬 Support WhatsApp →</a></td></tr></table>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a14;border-radius:0 0 16px 16px;border:1px solid rgba(255,107,0,0.1);border-top:none;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#4b5563;">© 2025 STARRIO Class — Pack Ultime 52 Formations</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ─── FedaPay Webhook Handler ─── */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('Webhook: RESEND_API_KEY non configurée');
      return NextResponse.json({ received: true, processed: false, reason: 'no_api_key' });
    }
    const resend = new Resend(apiKey);

    const body = await req.json();
    const eventName = body?.name || body?.event;
    const transaction = body?.data || body?.transaction;

    const isApproved =
      eventName === 'transaction.approved' ||
      transaction?.status === 'approved';

    if (!isApproved) {
      return NextResponse.json({ received: true, processed: false });
    }

    const customer = transaction?.customer;
    const email = customer?.email;

    if (!email) {
      return NextResponse.json({ received: true, processed: false, reason: 'no_email' });
    }

    const { data, error } = await resend.emails.send({
      from: 'STARRIO Class <aenestostarrio@gmail.com>',
      to: [email],
      subject: '✅ Vos accès au Pack Ultime 52 Formations sont prêts !',
      html: EMAIL_CONTENT_HTML,
    });

    if (error) {
      console.error('Resend error in webhook:', error);
      return NextResponse.json({ received: true, error }, { status: 200 });
    }

    return NextResponse.json({ received: true, processed: true, emailId: data?.id });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ received: true, error: 'server_error' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'FedaPay webhook endpoint active' });
}
