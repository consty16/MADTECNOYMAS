import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function ReviewsForm() {
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !comentario.trim()) {
      alert('Completa todos los campos');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('reviews')
      .insert([{ nombre, comentario }]);

    if (!error) {
      setNombre('');
      setComentario('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('Error al enviar reseña');
    }
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 p-6 bg-surface-container-highest/50 border border-primary/10 rounded-2xl backdrop-blur-sm"
    >
      <h3 className="text-lg font-bold text-primary mb-4">Dejá tu reseña</h3>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
          disabled={loading}
        />
        
        <textarea
          placeholder="Tu comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all text-sm resize-none"
          disabled={loading}
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Send size={16} />
          {loading ? 'Enviando...' : 'Enviar reseña'}
        </button>

        {success && (
          <p className="text-green-400 text-xs text-center">✅ Reseña publicada!</p>
        )}
      </div>
    </motion.form>
  );
}
