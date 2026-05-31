import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, payer, back_urls, auto_return, notification_url } = req.body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('Access token no configurado');
      return res.status(500).json({ error: 'Access token no configurado' });
    }

    // Crear preferencia en MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items,
        payer,
        back_urls,
        auto_return,
        notification_url,
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
        },
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('MP Error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const preference = await response.json();

    return res.status(200).json({
      id: preference.id,
      init_point: preference.init_point,
    });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    return res.status(500).json({
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Desconocido',
    });
  }
}