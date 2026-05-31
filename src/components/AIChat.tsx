import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Phone, Clock, CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente virtual de MAD TECNO. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleWhatsAppRedirect = () => {
    const message = "Hola MAD TECNO, tengo una consulta desde el sitio web.";
    window.open(`https://wa.me/543815341233?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `Eres el asistente virtual de "MAD TECNO Y MAS", una tienda de tecnología en Tucumán, Argentina.
          
          Tu objetivo es:
          1. Responder dudas generales sobre la tienda (horarios, ubicación, métodos de pago).
          2. Informar sobre productos (Smartwatches, Auriculares, Accesorios).
          3. PARA CUALQUIER DUDA ESPECÍFICA, CONSULTA DE STOCK REAL, O COORDINACIÓN DE COMPRA, DEBES REDIRIGIR AL CLIENTE A WHATSAPP.
          
          Información de la tienda:
          - Ubicación: San Miguel de Tucumán.
          - Horarios: Lunes a Viernes de 11:00 a 19:30.
          - Métodos de pago: Efectivo, Mercado Pago y Transferencias.
          - WhatsApp: +54 381 534-1233.
          
          Instrucciones de respuesta:
          - Sé amable, profesional y conciso.
          - Si el usuario pregunta por un producto específico o quiere comprar, dile que puede ver el catálogo en el sitio o hablar directamente por WhatsApp para una atención personalizada.
          - Siempre ofrece el botón de WhatsApp si la consulta requiere una respuesta humana o cierre de venta.`,
        }
      });

      const aiResponse = response.text || "Lo siento, hubo un problema al procesar tu mensaje. Por favor, contáctanos por WhatsApp.";
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Lo siento, no puedo responder en este momento. Por favor, escríbenos por WhatsApp para ayudarte mejor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 left-6 md:left-auto md:w-96 z-[100] glass-panel rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Asistente AI</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="space-y-4 h-[350px] overflow-y-auto no-scrollbar mb-6 pr-2"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`${
                    msg.role === 'user' 
                      ? 'bg-primary/20 ml-auto rounded-tr-none' 
                      : 'bg-surface-container-highest mr-auto rounded-tl-none'
                  } p-4 rounded-xl border border-primary/5 max-w-[90%]`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}
              
              {isLoading && (
                <div className="bg-surface-container-highest p-4 rounded-xl rounded-tl-none border border-primary/5 max-w-[90%] flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-xs text-on-surface-variant">Pensando...</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 pt-4">
                <button 
                  onClick={handleWhatsAppRedirect}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-left group"
                >
                  <Phone size={16} className="text-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-emerald-500">Hablar por WhatsApp</div>
                    <div className="text-[10px] text-on-surface-variant">Atención personalizada inmediata</div>
                  </div>
                  <ExternalLink size={12} className="ml-auto text-emerald-500/50" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <CreditCard size={12} className="text-primary" />
                    <span className="text-[10px] font-bold">Pagos: MP/Transf</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <Clock size={12} className="text-primary" />
                    <span className="text-[10px] font-bold">11:00 - 19:30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 border border-white/5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Pregúntame algo..."
                className="bg-transparent border-none focus:ring-0 text-sm flex-grow outline-none"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/20 flex items-center justify-center z-[101]"
      >
        <MessageSquare className="text-on-primary" fill="currentColor" />
      </motion.button>
    </>
  );
};
