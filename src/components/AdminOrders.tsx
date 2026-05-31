import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit2, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Order {
  id: string;
  nombre_apellido: string;
  mail: string;
  whatsapp: string;
  direccion: string;
  cod_postal: string;
  ciudad: string;
  provincia: string;
  estado_pago: string;
  estado_envio: string;
  numero_tracking: string | null;
  created_at: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Order>>({});

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('orders-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => fetchOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
    setLoading(false);
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setEditForm(order);
  };

  const handleSave = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from('orders')
      .update(editForm)
      .eq('id', editingId);
    if (!error) {
      setEditingId(null);
      fetchOrders();
    } else {
      alert('Error al guardar');
    }
  };

  if (loading) return <div className="text-center py-8 text-on-surface-variant">Cargando pedidos...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Pedidos ({orders.length})</h2>

      {editingId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-surface-container-low border border-primary/20 rounded-2xl mb-6"
        >
          <h3 className="text-lg font-bold text-primary mb-4">Editando Pedido</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-on-surface-variant">nombre_apellido</label>
              <input
                type="text"
                value={editForm.nombre_apellido || ''}
                onChange={(e) => setEditForm({ ...editForm, nombre_apellido: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                disabled
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant">mail</label>
              <input
                type="email"
                value={editForm.mail || ''}
                onChange={(e) => setEditForm({ ...editForm, mail: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                disabled
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant">estado_pago</label>
              <select
                value={editForm.estado_pago || ''}
                onChange={(e) => setEditForm({ ...editForm, estado_pago: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
              >
                <option value="pendiente">pendiente</option>
                <option value="pagado">pagado</option>
                <option value="rechazado">rechazado</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant">estado_envio</label>
              <select
                value={editForm.estado_envio || ''}
                onChange={(e) => setEditForm({ ...editForm, estado_envio: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
              >
                <option value="sin_enviar">sin_enviar</option>
                <option value="enviado">enviado</option>
                <option value="entregado">entregado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-on-surface-variant">numero_tracking</label>
              <input
                type="text"
                value={editForm.numero_tracking || ''}
                onChange={(e) => setEditForm({ ...editForm, numero_tracking: e.target.value })}
                placeholder="Dejar vacío si no hay"
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
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">nombre_apellido</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">mail</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">whatsapp</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">direccion</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">cod_postal</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">ciudad</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">provincia</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">estado_pago</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">estado_envio</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">numero_tracking</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-primary uppercase">created_at</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-primary uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-8 text-center text-on-surface-variant">
                  No hay pedidos
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-primary/5 hover:bg-surface-container-lowest/50 transition-all">
                  <td className="px-3 py-3 text-xs text-on-surface-variant font-mono">{order.id.slice(0, 6)}...</td>
                  <td className="px-3 py-3 text-xs font-bold text-primary">{order.nombre_apellido}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant break-all">{order.mail}</td>
                  <td className="px-3 py-3 text-xs text-primary">{order.whatsapp}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{order.direccion}</td>
                  <td className="px-3 py-3 text-xs text-primary">{order.cod_postal}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{order.ciudad}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{order.provincia}</td>
                  <td className="px-3 py-3 text-xs">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      order.estado_pago === 'pagado' ? 'bg-green-500/20 text-green-400' :
                      order.estado_pago === 'rechazado' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.estado_pago}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      order.estado_envio === 'entregado' ? 'bg-green-500/20 text-green-400' :
                      order.estado_envio === 'enviado' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.estado_envio}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant">{order.numero_tracking || '-'}</td>
                  <td className="px-3 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {new Date(order.created_at).toLocaleString('es-AR')}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleEdit(order)}
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