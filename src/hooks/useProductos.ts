import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface Producto {
  id: string;
  nombre: string;
  imagen: string;
  stock: number;
  precio: number;
  category?: string;
  mercadopago_link?: string;
  mercadopago_product_id?: string;
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carga inicial
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setProductos(data);
      setLoading(false);
    };

    fetchProductos();

    // Realtime
    const channelId = `productos-realtime-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'productos'
      }, () => {
        fetchProductos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { productos, loading };
}
