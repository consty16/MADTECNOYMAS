import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingCart, Truck } from 'lucide-react';
import { ShippingForm } from './ShippingForm';
import { useMercadoPago } from '../hooks/useMercadoPago';
import { supabase } from '../supabaseClient';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onCartChange: (items: any[]) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onCartChange,
}) => {
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingData, setShippingData] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const { createPreference, loading: mpLoading } = useMercadoPago();

  const handleQuantityChange = (index: number, delta: number) => {
    const newItems = [...cartItems];
    newItems[index].cantidad = Math.max(1, Math.min(10, newItems[index].cantidad + delta));
    onCartChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    onCartChange(newItems);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const total = subtotal + shippingCost;

  const handleContinueShopping = () => {
    onClose();
    // Scroll al catálogo
    const catalogSection = document.getElementById('zona-ahorro');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePayWithMercadoPago = async () => {
    if (!shippingData) {
      alert('Por favor completa el formulario de envío');
      return;
    }
    try {
      const { error: insertError } = await supabase
        .from('orders')
        .insert([{
          nombre_apellido: shippingData.nombre_apellido,
          mail: shippingData.mail,
          whatsapp: shippingData.whatsapp,
          direccion: shippingData.direccion,
          cod_postal: shippingData.cod_postal,
          ciudad: shippingData.ciudad,
          provincia: shippingData.provincia,
          estado_pago: 'pendiente',
          estado_envio: 'sin_enviar',
          numero_tracking: null,
        }]);
      if (insertError) {
        alert('Error al registrar el pedido. Intentá de nuevo.');
        return;
      }
      const result = await createPreference(cartItems, shippingData, shippingCost);
      if (result && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error('Error en pago:', error);
      alert('Error al procesar el pago');
    }
  };

  const handleWhatsApp = async () => {
    if (!shippingData) {
      alert('Por favor completa el formulario de envío');
      return;
    }
    await supabase
      .from('orders')
      .insert([{
        nombre_apellido: shippingData.nombre_apellido,
        mail: shippingData.mail,
        whatsapp: shippingData.whatsapp,
        direccion: shippingData.direccion,
        cod_postal: shippingData.cod_postal,
        ciudad: shippingData.ciudad,
        provincia: shippingData.provincia,
        estado_pago: 'pendiente',
        estado_envio: 'sin_enviar',
        numero_tracking: null,
      }]);
    const itemsList = cartItems
      .map(item => `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString('es-AR')}`)
      .join('\n');
    const message = `Hola MAD TECNO Y MAS! 🛒\n\nMi orden:\n${itemsList}\n\nSubtotal: $${subtotal.toLocaleString('es-AR')}\nEnvío: $${shippingCost.toLocaleString('es-AR')}\n*Total: $${total.toLocaleString('es-AR')}*\n\nDatos de entrega:\n${shippingData.nombre_apellido}\n${shippingData.direccion}, ${shippingData.cod_postal}\n${shippingData.ciudad}, ${shippingData.provincia}\n${shippingData.whatsapp}\n${shippingData.mail}\n\n¿Confirman disponibilidad?`;
    const url = `https://wa.me/543815341233?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-surface-container-highest rounded-2xl border border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface-container-highest border-b border-primary/20 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <ShoppingCart size={28} />
                Carrito ({cartItems.length})
              </h2>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Items */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-primary/40 mb-4" />
                  <p className="text-on-surface-variant text-lg mb-6">Tu carrito está vacío</p>
                  <button
                    onClick={handleContinueShopping}
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:brightness-110 transition-all"
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={index}
                        layout
                        className="flex gap-4 p-4 bg-surface-container rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                      >
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-20 h-20 object-contain rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-on-surface">{item.nombre}</h4>
                          <p className="text-primary font-bold">${item.precio.toLocaleString('es-AR')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(index, -1)}
                            className="p-1 hover:bg-primary/20 rounded text-primary transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-on-surface">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(index, 1)}
                            className="p-1 hover:bg-primary/20 rounded text-primary transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="ml-2 p-1 hover:bg-red-500/20 rounded text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Shipping Form */}
                  {!showShippingForm ? (
                    <button
                      onClick={() => setShowShippingForm(true)}
                      className="w-full py-3 bg-primary/20 border border-primary/40 text-primary rounded-lg font-bold hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Truck size={20} />
                      {shippingData ? 'Editar datos de envío' : 'Agregar datos de envío'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <ShippingForm
                        onShippingDataChange={(data) => {
                          setShippingData(data);
                        }}
                        onShippingCostChange={setShippingCost}
                        shippingData={shippingData}
                      />
                      <button
                        onClick={() => setShowShippingForm(false)}
                        className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-xs"
                      >
                        Confirmar Datos
                      </button>
                    </div>
                  )}

                  {/* Totals */}
                  {shippingData && (
                    <div className="bg-surface-container p-4 rounded-lg border border-primary/20 space-y-2">
                      <div className="flex justify-between text-on-surface">
                        <span>Subtotal:</span>
                        <span>${subtotal.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between text-on-surface">
                        <span>Envío a {shippingData.ciudad}:</span>
                        <span>${shippingCost.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="border-t border-primary/20 pt-2 flex justify-between text-primary text-lg font-bold">
                        <span>Total:</span>
                        <span>${total.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-primary/20">
                    {shippingData && (
                      <button
                        onClick={handlePayWithMercadoPago}
                        disabled={mpLoading}
                        className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {mpLoading ? 'Procesando...' : '💳 Pagar con MercadoPago'}
                      </button>
                    )}

                    <button
                      onClick={handleWhatsApp}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      💬 Continuar por WhatsApp
                    </button>

                    <button
                      onClick={handleContinueShopping}
                      className="w-full py-3 bg-surface-container border border-primary/40 text-primary rounded-lg font-bold hover:bg-surface-container-highest transition-all"
                    >
                      ← Seguir comprando
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};