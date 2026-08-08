import crypto from 'crypto';

export const PIXEL_ID = '1191042257432191';
export const CAPI_ACCESS_TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN ||
  'EAANpPLXf0CIBSMeUkwmo1bWvaDeZB8oWZBH05uFPNnAZBsESSBjOd7Tbhg1B7EmukpERSIRf0mEAXRZBQw60txGPDsrcsXXhsNnjqZBC5GRfnF5Q5NUyYxaC6mFRWLFAY3sxvxfMBwTuwT0wYJ6bb99SNf9HnzaZB14pai1YUc2beBR7CiSAhEXKGcsvZC0Qd9slAZDZD';

/* Helper pour hacher en SHA-256 selon les standards Meta (lowercase + trim) */
function hashSha256(value?: string | null): string | null {
  if (!value) return null;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) return null;
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

/* Helper pour nettoyer et normaliser le numéro de téléphone */
function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  /* Si le numéro commence par 0 (ex: 0161973836), ajouter l'indicatif Bénin 229 */
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = '229' + digits.substring(1);
  }
  return digits;
}

export interface CapiPurchaseParams {
  eventId: string;
  email?: string;
  phone?: string;
  name?: string;
  amount?: number;
  currency?: string;
  clientIp?: string | null;
  userAgent?: string | null;
  eventSourceUrl?: string;
}

/**
 * Envoie un événement 'Purchase' à l'API Conversions (CAPI) Meta Graph v19.0
 */
export async function sendMetaCapiPurchaseEvent(params: CapiPurchaseParams) {
  try {
    const {
      eventId,
      email,
      phone,
      name,
      amount = 2500,
      currency = 'XOF',
      clientIp,
      userAgent,
      eventSourceUrl = 'https://pack-de-formation.vercel.app/merci',
    } = params;

    const firstName = name ? name.trim().split(' ')[0] : '';
    const lastName = name && name.trim().split(' ').length > 1 ? name.trim().split(' ').slice(1).join(' ') : '';

    const hashedEm = hashSha256(email);
    const normalizedPh = normalizePhone(phone);
    const hashedPh = hashSha256(normalizedPh);
    const hashedFn = hashSha256(firstName);
    const hashedLn = hashSha256(lastName);

    /* Construction de user_data avec Advanced Matching */
    const userData: Record<string, unknown> = {};
    if (hashedEm) userData.em = [hashedEm];
    if (hashedPh) userData.ph = [hashedPh];
    if (hashedFn) userData.fn = [hashedFn];
    if (hashedLn) userData.ln = [hashedLn];
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;

    const eventPayload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            value: amount,
            currency: currency,
            content_name: 'Pack Ultime 52 Formations',
            content_ids: ['pack-52-formations'],
            content_type: 'product',
            num_items: 1,
          },
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CAPI_ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    });

    const data = await response.json();
    console.log(`✅ Meta CAPI Purchase envoyé avec succès ! EventID: ${eventId} | Response:`, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('❌ Meta CAPI Error:', error);
    return null;
  }
}
