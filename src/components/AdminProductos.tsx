import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Producto {
  id: string;
  nombre: string;
  imagen: string;
  stock: number;
  precio: number;
  category?: string;
  mercadopago_link?: string;
  mercadopago_product_id?: string;
  created_at: string;
}

export function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    stock: 0,
    precio: 0,
    category: 'oferta',
    mercadopago_link: '',
    mercadopago_product_id: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProductos();
    const channel = supabase
      .channel('productos-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'productos'
      }, () => fetchProductos())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProductos(data);
    setLoading(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setErrorMsg(null);
    setFormData({
      nombre: '',
      imagen: '',
      stock: 0,
      precio: 0,
      category: 'oferta',
      mercadopago_link: '',
      mercadopago_product_id: '',
    });
  };

  const handleEditClick = (prod: Producto) => {
    setEditingId(prod.id);
    setErrorMsg(null);
    setFormData({
      nombre: prod.nombre,
      imagen: prod.imagen,
      stock: prod.stock,
      precio: prod.precio,
      category: prod.category || 'oferta',
      mercadopago_link: prod.mercadopago_link || '',
      mercadopago_product_id: prod.mercadopago_product_id || '',
    });
  };

  const handleSave = async () => {
    setErrorMsg(null);
    if (!formData.nombre || !formData.imagen) {
      setErrorMsg('Nombre e imagen son obligatorios');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('productos')
          .update(formData)
          .eq('id', editingId);
        if (!error) {
          setEditingId(null);
          fetchProductos();
        } else {
          console.error('Error actualizando producto:', error);
          setErrorMsg(`Error al actualizar: ${error.message || 'Error desconocido'}`);
        }
      } else {
        const { error } = await supabase
          .from('productos')
          .insert([formData]);
        if (!error) {
          setIsAdding(false);
          fetchProductos();
        } else {
          console.error('Error insertando producto:', error);
          setErrorMsg(`Error al crear: ${error.message || 'Error desconocido'}`);
        }
      }
    } catch (err: any) {
      console.error('Excepción al guardar:', err);
      setErrorMsg(`Excepción al guardar: ${err.message || 'Error desconocido'}`);
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);
      if (!error) {
        setDeletingId(null);
        fetchProductos();
      } else {
        console.error('Error eliminando producto:', error);
        setErrorMsg(`Error al eliminar: ${error.message || 'Error desconocido'}`);
      }
    } catch (err: any) {
      console.error('Excepción al eliminar:', err);
      setErrorMsg(`Excepción al eliminar: ${err.message || 'Error desconocido'}`);
    }
  };

  if (loading) return <div className="text-center py-8 text-on-surface-variant">Cargando productos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Productos ({productos.length})</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-surface-container-low border border-primary/20 rounded-2xl mb-6"
          >
            <h3 className="text-lg font-bold text-primary mb-4">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-on-surface-variant">nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">imagen</label>
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">stock</label>
                <input
                  type="number"
                  placeholder="Cantidad en stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">precio</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm text-primary"
                >
                  <option value="oferta">Oferta</option>
                  <option value="destacado">Destacado</option>
                  <option value="smartwatch">Smartwatch / Mallas</option>
                  <option value="herramientas">Herramientas</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="audio">Audio</option>
                  <option value="electricidad">Electricidad</option>
                  <option value="informatica">Informática</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Mercado Pago Link (Opcional)</label>
                <input
                  type="text"
                  placeholder="https://mpago.la/..."
                  value={formData.mercadopago_link}
                  onChange={(e) => setFormData({ ...formData, mercadopago_link: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Mercado Pago Product ID (Opcional)</label>
                <input
                  type="text"
                  placeholder="MP-PROD-XXXX"
                  value={formData.mercadopago_product_id}
                  onChange={(e) => setFormData({ ...formData, mercadopago_product_id: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-sm text-primary"
                />
              </div>
            </div>

            {formData.imagen && (
              <div className="mt-4">
                <img
                  src={formData.imagen}
                  alt="Preview"
                  className="h-32 w-32 bg-black/20 rounded-lg object-contain p-2"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Error';
                  }}
                />
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg font-bold text-sm hover:bg-green-500/30 transition-all"
              >
                <Save size={16} />
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold text-sm hover:bg-red-500/30 transition-all"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLA */}
      <div className="overflow-x-auto border border-primary/10 rounded-xl">
        <table className="w-full">
          <thead className="bg-surface-container-lowest border-b border-primary/10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">id</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">nombre</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">imagen</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">categoría</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">stock</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">precio</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">Mercado Pago Link</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">MP Product ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">created_at</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-on-surface-variant">
                  No hay productos
                </td>
              </tr>
            ) : (
              productos.map(prod => (
                <tr key={prod.id} className="border-b border-primary/5 hover:bg-surface-container-lowest/50 transition-all">
                  <td className="px-4 py-3 text-xs text-on-surface-variant font-mono">{prod.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">{prod.nombre}</td>
                  <td className="px-4 py-3">
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="h-10 w-10 bg-black/20 rounded object-contain p-1"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant font-mono font-semibold uppercase">{prod.category || 'oferta'}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold">{prod.stock}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold">${prod.precio.toLocaleString('es-AR')}</td>
                  <td className="px-4 py-2 text-xs truncate max-w-[150px]" title={prod.mercadopago_link || ''}>
                    {prod.mercadopago_link ? (
                      <a href={prod.mercadopago_link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline inline-flex items-center gap-1 font-semibold">
                        Link <span className="text-[10px]">↗</span>
                      </a>
                    ) : (
                      <span className="text-on-surface-variant/40">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-on-surface-variant font-mono truncate max-w-[120px]" title={prod.mercadopago_product_id || ''}>
                    {prod.mercadopago_product_id || <span className="text-on-surface-variant/40">-</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {new Date(prod.created_at).toLocaleString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-center col-span-1">
                    <div className="flex gap-2 justify-center min-w-[70px]">
                      {deletingId === prod.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-bold hover:bg-red-500/30 cursor-pointer"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-semibold hover:bg-primary/20 cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 hover:bg-primary/20 text-primary rounded transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingId(prod.id)}
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-all cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
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