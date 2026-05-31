import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabaseClient';

interface ShippingInfo {
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

export function AdminShippingInfo() {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShippingInfo();
    const channel = supabase
      .channel('shipping-info-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shipping_info'
      }, () => fetchShippingInfo())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchShippingInfo = async () => {
    const { data, error } = await supabase
      .from('shipping_info')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setShippingInfo(data);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8 text-on-surface-variant">Cargando datos de envío...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Datos de Envío ({shippingInfo.length})</h2>

      {/* TABLA */}
      <div className="overflow-x-auto border border-primary/10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-surface-container-lowest border-b border-primary/10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">id</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">nombre_apellido</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">mail</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">whatsapp</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">direccion</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">cod_postal</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">ciudad</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">provincia</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">created_at</th>
            </tr>
          </thead>
          <tbody>
            {shippingInfo.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-on-surface-variant">
                  No hay datos de envío
                </td>
              </tr>
            ) : (
              shippingInfo.map(info => (
                <tr key={info.id} className="border-b border-primary/5 hover:bg-surface-container-lowest/50 transition-all">
                  <td className="px-3 py-3 text-xs text-on-surface-variant font-mono">{info.id.slice(0, 6)}...</td>
                  <td className="px-3 py-3 text-xs font-bold text-primary">{info.nombre_apellido}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant break-all">{info.mail}</td>
                  <td className="px-3 py-3 text-xs text-primary">{info.whatsapp}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{info.direccion}</td>
                  <td className="px-3 py-3 text-xs text-primary">{info.cod_postal}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{info.ciudad}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{info.provincia}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {new Date(info.created_at).toLocaleString('es-AR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}