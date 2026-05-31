import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface ShippingInfo {
  id: string;
  nombre_apellido: string;
  mail: string;
  whatsapp: string;
  direccion: string;
  cod_postal: string;
  ciudad: string;
  provincia: string;
  created_at: string;
}

export function useShippingInfo() {
  const [shippingData, setShippingData] = useState<ShippingInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingInfo = async () => {
      const { data, error } = await supabase
        .from('shipping_info')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setShippingData(data);
      setLoading(false);
    };

    fetchShippingInfo();

    // Realtime
    const channelId = `shipping-info-realtime-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shipping_info'
      }, () => {
        fetchShippingInfo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { shippingData, loading };
}
