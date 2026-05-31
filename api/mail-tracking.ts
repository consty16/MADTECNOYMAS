import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mail, nombre_apellido, numero_tracking, ciudad, provincia } = req.body;

    if (!mail || !nombre_apellido || !numero_tracking) {
      return res.status(400).json({ error: 'Parámetros requeridos incompletos' });
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
        subject: '📦 Tu pedido ha sido enviado - MAD TECNO Y MAS',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000e23; color: #56f1e0; padding: 40px; border-radius: 10px;">
            <h1 style="color: #56f1e0; text-align: center; margin-bottom: 20px;">📦 ¡Tu pedido está en camino!</h1>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Hola <strong>${nombre_apellido}</strong>,
            </p>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Tu pedido ha sido despachado y está en camino a <strong>${ciudad}, ${provincia}</strong>. A continuación encontrarás tu número de tracking para seguir el estado de tu envío:
            </p>
            
            <div style="background: #0c1a30; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff00ff;">
              <p style="margin: 10px 0; font-size: 14px; color: #ffffff;">
                <strong>Número de Tracking:</strong>
              </p>
              <p style="margin: 10px 0; font-size: 24px; color: #ff00ff; font-weight: bold; letter-spacing: 2px;">
                ${numero_tracking}
              </p>
              <p style="margin: 10px 0; font-size: 12px; color: #56f1e0;">
                Utiliza este número para rastrear tu envío en Correo Argentino
              </p>
            </div>
            
            <p style="font-size: 16px; margin: 20px 0;">
              <strong>¿Cómo rastrear mi envío?</strong>
            </p>
            
            <p style="font-size: 14px; margin: 10px 0;">
              1. Visita <a href="https://www.correoargentino.com.ar" style="color: #56f1e0;">www.correoargentino.com.ar</a>
            </p>
            <p style="font-size: 14px; margin: 10px 0;">
              2. Ingresa tu número de tracking: <strong>${numero_tracking}</strong>
            </p>
            <p style="font-size: 14px; margin: 10px 0;">
              3. Verás el estado actualizado de tu envío en tiempo real
            </p>
            
            <p style="font-size: 16px; margin: 20px 0;">
              El envío típicamente toma entre 5-10 días hábiles según la región.
            </p>
            
            <p style="font-size: 16px; margin: 20px 0;">
              Si tienes problemas, no dudes en contactarnos:
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
Tu pedido ha sido enviado
========================

Hola ${nombre_apellido},

Tu pedido está en camino a ${ciudad}, ${provincia}.

Número de Tracking: ${numero_tracking}

Rastrear en: https://www.correoargentino.com.ar
Ingresa tu número de tracking para ver el estado actualizado.

El envío típicamente toma entre 5-10 días hábiles.

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
    console.log('Email de tracking enviado:', result);

    return res.status(200).json({
      success: true,
      message: 'Email de tracking enviado correctamente',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error en mail-tracking:', error);
    return res.status(500).json({
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Desconocido',
    });
  }
}
