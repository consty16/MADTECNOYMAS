import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mail, nombre_apellido, total_compra, numero_tracking } = req.body;

    if (!mail || !nombre_apellido) {
      return res.status(400).json({ error: 'Email y nombre son requeridos' });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error('BREVO_API_KEY no configurada');
      return res.status(500).json({ error: 'API key no configurada' });
    }

    // Enviar email con Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'MAD TECNO Y MAS',
          email: 'consty16@gmail.com',
        },
        to: [
          {
            email: mail,
            name: nombre_apellido,
          },
        ],
        subject: '✅ ¡Pago Confirmado! - MAD TECNO Y MAS',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000e23; color: #56f1e0; padding: 40px; border-radius: 10px;">
            <h1 style="color: #56f1e0; text-align: center; margin-bottom: 20px;">¡Pago Confirmado!</h1>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Hola <strong>${nombre_apellido}</strong>,
            </p>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Tu pago ha sido procesado exitosamente. A continuación encontrarás los detalles de tu compra:
            </p>
            
            <div style="background: #0c1a30; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #56f1e0;">
              <p style="margin: 10px 0;"><strong>Total de la compra:</strong> $${Number(total_compra).toLocaleString('es-AR')}</p>
              <p style="margin: 10px 0;"><strong>Referencia de pago:</strong> ${numero_tracking}</p>
              <p style="margin: 10px 0;"><strong>Estado:</strong> <span style="color: #00ff00;">✓ Pagado</span></p>
            </div>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Tu pedido será procesado en las próximas 24 horas. Recibirás un email con los detalles del envío cuando tu producto sea despachado.
            </p>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Si tienes preguntas, no dudes en contactarnos por WhatsApp:
            </p>
            
            <a href="https://wa.me/543815341233" style="display: inline-block; background: #56f1e0; color: #000e23; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Contactar por WhatsApp
            </a>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #56f1e0; text-align: center; font-size: 12px; color: #56f1e0;">
              <p>MAD TECNO Y MAS © 2026</p>
              <p>Todos los derechos reservados</p>
            </div>
          </div>
        `,
        textContent: `
Pago Confirmado
==============

Hola ${nombre_apellido},

Tu pago ha sido procesado exitosamente.

Total: $${Number(total_compra).toLocaleString('es-AR')}
Referencia: ${numero_tracking}
Estado: ✓ Pagado

Tu pedido será procesado en las próximas 24 horas.

Contacta por WhatsApp: https://wa.me/543815341233
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error enviando email con Brevo:', errorData);
      return res.status(response.status).json(errorData);
    }

    const result = await response.json();
    console.log('Email enviado exitosamente:', result);

    return res.status(200).json({
      success: true,
      message: 'Email enviado correctamente',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error en mail-pago:', error);
    return res.status(500).json({
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Desconocido',
    });
  }
}
