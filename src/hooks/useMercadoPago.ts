import { useState } from 'react';

interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface ShippingData {
  nombre_apellido: string;
  mail: string;
  whatsapp: string;
  direccion: string;
  cod_postal: string;
  ciudad: string;
  provincia: string;
}

export function useMercadoPago() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPreference = async (
    cartItems: CartItem[],
    shippingData: ShippingData,
    shippingCost: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Calcular subtotal
      const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      const total = subtotal + shippingCost;

      // Preparar items para MercadoPago
      const items = cartItems.map(item => ({
        id: item.id,
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'ARS',
      }));

      // Agregar shipping como item separado
      items.push({
        id: 'shipping',
        title: `Envío a ${shippingData.ciudad}, ${shippingData.provincia}`,
        quantity: 1,
        unit_price: shippingCost,
        currency_id: 'ARS',
      });

      const preferenceData = {
        items,
        payer: {
          name: shippingData.nombre_apellido.split(' ')[0],
          surname: shippingData.nombre_apellido.split(' ')[1] || '',
          email: shippingData.mail,
          phone: {
            area_code: '54',
            number: parseInt(shippingData.whatsapp.replace(/\D/g, '')) || 0,
          },
          address: {
            street_name: shippingData.direccion,
            zip_code: shippingData.cod_postal,
          },
        },
        back_urls: {
          success: `${window.location.origin}/success`,
          failure: `${window.location.origin}/failure`,
          pending: `${window.location.origin}/pending`,
        },
        auto_return: 'approved',
        notification_url: (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.live'))
          ? `${window.location.origin}/.netlify/functions/webhook-mp`
          : `${window.location.origin}/api/webhook-mp`,
      };

      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.live');
      const primaryUrl = isNetlify ? '/.netlify/functions/create-preference' : '/api/create-preference';
      const secondaryUrl = isNetlify ? '/api/create-preference' : '/.netlify/functions/create-preference';

      let response;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferenceData),
        });

        if (response.status === 404) {
          response = await fetch(secondaryUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferenceData),
          });
        }
      } catch (e) {
        response = await fetch(secondaryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferenceData),
        });
      }

      if (!response.ok) {
        throw new Error('Error al crear preferencia en MercadoPago');
      }

      const data = await response.json();

      // Retorna URL de checkout
      return {
        preferenceId: data.id,
        checkoutUrl: data.init_point,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPreference, loading, error };
}