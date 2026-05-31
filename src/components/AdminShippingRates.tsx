import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit2, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ShippingRate {
  id: string;
  zona: string;
  precio_base: number;
  precio_por_kg: number;
  peso_max: number;
  updated_at: string;
}

export function AdminShippingRates() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ShippingRate>>({});

  useEffect(() => {
    fetchRates();
    const channel = supabase
      .channel('shipping-rates-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shipping_rates'
      }, () => fetchRates())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRates = async () => {
    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .order('zona', { ascending: true });
    if (!error && data) setRates(data);
    setLoading(false);
  };

  const handleEdit = (rate: ShippingRate) => {
    setEditingId(rate.id);
    setEditForm(rate);
  };

  const handleSave = async () => {
    if (!editingId) return;

    if (!editForm.precio_base || !editForm.precio_por_kg || !editForm.peso_max) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const { error } = await supabase
      .from('shipping_rates')
      .update({
        zona: editForm.zona,
        precio_base: parseFloat(editForm.precio_base.toString()),
        precio_por_kg: parseFloat(editForm.precio_por_kg.toString()),
        peso_max: parseFloat(editForm.peso_max.toString()),
      })
      .eq('id', editingId);

    if (!error) {
      setEditingId(null);
      fetchRates();
    } else {
      alert('Error al guardar');
    }
  };

  if (loading) return <div className="text-center py-8 text-on-surface-variant">Cargando tarifas...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Tarifas de Envío ({rates.length})</h2>

      {editingId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-surface-container-low border border-primary/20 rounded-2xl mb-6"
        >
          <h3 className="text-lg font-bold text-primary mb-4">Editando Tarifa</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-on-surface-variant">zona</label>
              <input
                type="text"
                value={editForm.zona || ''}
                onChange={(e) => setEditForm({ ...editForm, zona: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                disabled
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant">precio_base</label>
              <input
                type="number"
                step="0.01"
                value={editForm.precio_base || 0}
                onChange={(e) => setEditForm({ ...editForm, precio_base: parseFloat(e.target.value) })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant">precio_por_kg</label>
              <input
                type="number"
                step="0.01"
                value={editForm.precio_por_kg || 0}
                onChange={(e) => setEditForm({ ...editForm, precio_por_kg: parseFloat(e.target.value) })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant">peso_max</label>
              <input
                type="number"
                step="0.01"
                value={editForm.peso_max || 0}
                onChange={(e) => setEditForm({ ...editForm, peso_max: parseFloat(e.target.value) })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg font-bold text-sm hover:bg-green-500/30 transition-all"
            >
              <Save size={16} />
              Guardar
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold text-sm hover:bg-red-500/30 transition-all"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* TABLA */}
      <div className="overflow-x-auto border border-primary/10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-surface-container-lowest border-b border-primary/10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">id</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">zona</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">precio_base</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">precio_por_kg</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">peso_max</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">updated_at</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-primary uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  No hay tarifas de envío
                </td>
              </tr>
            ) : (
              rates.map(rate => (
                <tr key={rate.id} className="border-b border-primary/5 hover:bg-surface-container-lowest/50 transition-all">
                  <td className="px-3 py-3 text-xs text-on-surface-variant font-mono">{rate.id.slice(0, 6)}...</td>
                  <td className="px-3 py-3 text-xs font-bold text-primary">{rate.zona}</td>
                  <td className="px-3 py-3 text-xs text-primary">${rate.precio_base.toLocaleString('es-AR')}</td>
                  <td className="px-3 py-3 text-xs text-primary">${rate.precio_por_kg.toLocaleString('es-AR')}</td>
                  <td className="px-3 py-3 text-xs text-primary">{rate.peso_max}kg</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {new Date(rate.updated_at).toLocaleString('es-AR')}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleEdit(rate)}
                      className="p-1.5 hover:bg-primary/20 text-primary rounded transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
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