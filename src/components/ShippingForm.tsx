import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { supabase } from '../supabaseClient';

export interface ShippingData {
  nombre_apellido: string;
  mail: string;
  whatsapp: string;
  direccion: string;
  cod_postal: string;
  ciudad: string;
  provincia: string;
}

interface ShippingFormProps {
  onShippingDataChange: (data: ShippingData | null) => void;
  onShippingCostChange: (cost: number) => void;
  shippingData: ShippingData | null;
}

export function ShippingForm({
  onShippingDataChange,
  onShippingCostChange,
  shippingData,
}: ShippingFormProps) {
  const [formData, setFormData] = useState({
    nombre_apellido: shippingData?.nombre_apellido || '',
    mail: shippingData?.mail || '',
    whatsapp: shippingData?.whatsapp || '',
    direccion: shippingData?.direccion || '',
    cod_postal: shippingData?.cod_postal || '',
    ciudad: shippingData?.ciudad || '',
    provincia: shippingData?.provincia || '',
  });

  const [shippingRates, setShippingRates] = useState<any[]>([]);

  // Cargar tarifas de envío
  useEffect(() => {
    const fetchRates = async () => {
      const { data } = await supabase.from('shipping_rates').select('*');
      if (data) setShippingRates(data);
    };
    fetchRates();
  }, []);

  // Recalcular costo de envío cada vez que se carguen tarifas o cambie el código postal
  useEffect(() => {
    if (shippingRates.length > 0 && formData.cod_postal) {
      const cp = parseInt(formData.cod_postal);
      let zona = 'AMBA';
      if (cp >= 1000 && cp <= 1999) zona = 'AMBA';
      else if (cp >= 2000 && cp <= 2999) zona = 'Zona 1 - Buenos Aires provincia';
      else if (cp >= 3000 && cp <= 3999) zona = 'Zona 2 - Litoral y Cuyo';
      else if (cp >= 4000 && cp <= 4999) zona = 'Zona 3 - Centro';
      else if (cp >= 5000 && cp <= 5999) zona = 'Zona 4 - NOA y NEA';
      else if (cp >= 6000 && cp <= 9999) zona = 'Zona 5 - Patagonia';

      const rate = shippingRates.find(r => r.zona === zona);
      if (rate) {
        onShippingCostChange(rate.precio_base);
      } else {
        onShippingCostChange(0);
      }
    } else {
      onShippingCostChange(0);
    }
  }, [shippingRates, formData.cod_postal, onShippingCostChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // Validar completitud
    const allFilled = Object.values(nextFormData).every((v) => (v as string).trim() !== '');
    if (allFilled) {
      onShippingDataChange(nextFormData);
    } else {
      onShippingDataChange(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface-container-lowest border border-primary/10 rounded-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-primary" size={20} />
        <h3 className="text-lg font-bold text-primary">Datos de envío</h3>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name="nombre_apellido"
          placeholder="Nombre y Apellido"
          value={formData.nombre_apellido}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
          required
        />

        <input
          type="email"
          name="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
          required
        />

        <input
          type="tel"
          name="whatsapp"
          placeholder="WhatsApp (ej: 5493815341233)"
          value={formData.whatsapp}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
          required
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="cod_postal"
            placeholder="Código Postal"
            value={formData.cod_postal}
            onChange={handleChange}
            className="px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
            required
          />

          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className="px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
            required
          />
        </div>

        <select
          name="provincia"
          value={formData.provincia}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm text-on-surface"
          required
        >
          <option value="">Selecciona Provincia</option>
          <option value="Buenos Aires">Buenos Aires</option>
          <option value="CABA">CABA</option>
          <option value="Córdoba">Córdoba</option>
          <option value="Santa Fe">Santa Fe</option>
          <option value="Mendoza">Mendoza</option>
          <option value="Tucumán">Tucumán</option>
          <option value="Misiones">Misiones</option>
          <option value="Corrientes">Corrientes</option>
          <option value="Entre Ríos">Entre Ríos</option>
          <option value="La Pampa">La Pampa</option>
          <option value="Neuquén">Neuquén</option>
          <option value="Río Negro">Río Negro</option>
          <option value="Chubut">Chubut</option>
          <option value="Santa Cruz">Santa Cruz</option>
          <option value="Tierra del Fuego">Tierra del Fuego</option>
          <option value="San Luis">San Luis</option>
          <option value="San Juan">San Juan</option>
          <option value="La Rioja">La Rioja</option>
          <option value="Catamarca">Catamarca</option>
          <option value="Formosa">Formosa</option>
          <option value="Chaco">Chaco</option>
          <option value="Santiago del Estero">Santiago del Estero</option>
          <option value="Salta">Salta</option>
          <option value="Jujuy">Jujuy</option>
        </select>
      </div>
    </motion.div>
  );
}
