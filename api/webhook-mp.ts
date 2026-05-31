import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables are not set. Supabase client cannot be initialized.');
      return null;
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    // MercadoPago envía diferentes tipos de notificaciones
    if (data?.type === 'payment') {
      const paymentId = data.id;

      // Obtener detalles del pago desde MercadoPago
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!mpResponse.ok) {
        console.error('Error obteniendo detalles de pago de MP');
        return res.status(200).json({ received: true });
      }

      const payment = await mpResponse.json();

      // Si el pago fue aprobado
      if (payment.status === 'approved') {
        const supabase = getSupabase();
        if (!supabase) {
          console.error('No se pudo procesar la orden: Supabase no está configurado.');
          return res.status(200).json({ received: true, error: 'Database not configured' });
        }

        // Buscar la order en Supabase por el external_reference
        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('mail', payment.payer?.email)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!orderError && orders && orders.length > 0) {
          const order = orders[0];

          // Actualizar estado de pago
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              estado_pago: 'pagado',
              numero_tracking: `MP-${paymentId}`,
            })
            .eq('id', order.id);

          if (!updateError) {
            console.log(`Pago confirmado para orden ${order.id}`);
            // El trigger de Supabase dispará notify_pago_confirmado
            // Que llamará a /api/mail-pago
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook de MercadoPago:', error);
    return res.status(200).json({ received: true }); // Siempre responder 200 a MP
  }
}
