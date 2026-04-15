import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Smartphone, Watch, Zap, Sparkles, MessageCircle, Mail, MapPin, BookOpen, ShoppingCart, Star, ChevronLeft, ChevronRight, Play, Home } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { AIChat } from './components/AIChat';
import { CatalogModal } from './components/CatalogModal';
import { CartModal } from './components/CartModal';
import { ReviewsModal } from './components/ReviewsModal';
import { CATALOG_IMAGES, OFFER_BANNER_IMAGES, PRODUCTS, REVIEWS, REEL_VIDEOS } from './constants';

export default function App() {
  const [isCatalogOpen, setIsCatalogOpen] = React.useState(false);
  const [catalogIndex, setCatalogIndex] = React.useState(0);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const catalogScrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const scrollCatalog = (direction: 'left' | 'right') => {
    if (catalogScrollRef.current) {
      const { scrollLeft, clientWidth } = catalogScrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      catalogScrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const offers = PRODUCTS.filter(p => p.category === 'oferta');
  const featured = PRODUCTS.filter(p => p.category === 'destacado');
  const smartwatches = PRODUCTS.filter(p => p.category === 'smartwatch');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_20px_rgba(86,241,224,0.1)]">
        <div className="max-w-7xl mx-auto px-6 h-12 md:h-16 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 0, 255, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff00ff]/10 border border-[#ff00ff]/40 rounded-lg text-[#ff00ff] hover:bg-[#ff00ff]/20 transition-all shadow-[0_0_20px_rgba(255, 0, 255, 0.4)] font-bold uppercase tracking-widest text-[10px] md:text-xs"
          >
            <Home size={14} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(255, 0, 255, 0.8)]" />
            <span className="drop-shadow-[0_0_3px_rgba(255, 0, 255, 0.5)]">Inicio</span>
          </motion.button>
          
          <nav className="flex items-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(86, 241, 224, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/40 rounded-lg text-primary hover:bg-primary/20 transition-all shadow-[0_0_20px_rgba(86, 241, 224, 0.4)] font-bold"
              >
                <MessageCircle size={14} className="drop-shadow-[0_0_8px_rgba(86, 241, 224, 0.8)]" />
                <span className="drop-shadow-[0_0_3px_rgba(86, 241, 224, 0.5)]">Contacto</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 0, 255, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReviewsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#ff00ff]/10 border border-[#ff00ff]/40 rounded-lg text-[#ff00ff] hover:bg-[#ff00ff]/20 transition-all shadow-[0_0_20px_rgba(255, 0, 255, 0.4)] font-bold"
              >
                <Play size={14} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(255, 0, 255, 0.8)]" />
                <span className="drop-shadow-[0_0_3px_rgba(255, 0, 255, 0.5)]">Reviews</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(86, 241, 224, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/40 rounded-lg text-primary hover:bg-primary/20 transition-all shadow-[0_0_20px_rgba(86, 241, 224, 0.4)] font-bold"
              >
                <ShoppingCart size={14} className="drop-shadow-[0_0_8px_rgba(86, 241, 224, 0.8)]" />
                <span className="hidden sm:inline drop-shadow-[0_0_3px_rgba(86, 241, 224, 0.5)]">Carrito de compras</span>
                <span className="sm:hidden drop-shadow-[0_0_3px_rgba(86, 241, 224, 0.5)]">Carrito</span>
              </motion.button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="inicio" className="relative px-6 pt-4 md:pt-6 pb-16 md:pb-24 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px]" />
 
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img 
                src="/logo.png" 
                alt="MAD TECNO Y MAS" 
                className="mx-auto h-64 md:h-[32rem] w-auto object-contain mb-1 mt-[-6rem] md:mt-[-10rem] drop-shadow-[0_0_40px_rgba(86,241,224,0.6)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  filter: ["drop-shadow(0 0 15px rgba(86,241,224,0.4))", "drop-shadow(0 0 40px rgba(86,241,224,0.7))", "drop-shadow(0 0 15px rgba(86,241,224,0.4))"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 55px rgba(86,241,224,0.9))" }}
                referrerPolicy="no-referrer"
              />
              <h2 className="text-4xl md:text-7xl font-bold text-primary mb-10 mt-[-3rem] md:mt-[-6rem]">
                ¿QUIENES SOMOS?
              </h2>
              <p className="text-lg md:text-2xl text-white leading-relaxed mb-6 max-w-3xl mx-auto drop-shadow-[0_0_15px_rgba(86,241,224,0.8)]">
                Nos dedicamos a la venta online de productos electrónicos, también vendemos por pedido.
                Si necesitas reparar tu PC o reinstalar tu Office, ¡también cuenta con nosotros!.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Super Ofertas */}
        <section className="pt-16 pb-8 px-6 bg-surface-container-low/30">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3 mb-10"
            >
              <Sparkles className="text-tertiary" size={32} />
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-tertiary">
                  APROVECHA ESTAS SUPER OFERTAS!.
                </h3>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest mt-1">
                  Precios imbatibles por tiempo limitado
                </p>
              </div>
            </motion.div>

            {/* Banner Carousel */}
            <div className="relative group max-w-7xl mx-auto mb-12">
              <div 
                ref={scrollRef}
                className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12 px-4 md:px-8 lg:justify-center"
              >
                {OFFER_BANNER_IMAGES.map((image, index) => (
                  <motion.div
                    key={index}
                    className="flex-none w-[85%] md:w-[45%] lg:w-[31%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-tertiary/20 snap-center bg-surface-container-low"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={image}
                      alt={`Oferta ${index + 1}`}
                      className="w-full h-full object-contain bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hidden md:flex hover:bg-primary hover:text-on-primary"
                aria-label="Previous slide"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hidden md:flex hover:bg-primary hover:text-on-primary"
                aria-label="Next slide"
              >
                <ChevronRight size={28} />
              </button>

              {/* Mobile Arrows */}
              <div className="flex justify-center gap-6 mt-4 md:hidden">
                <button
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {offers.length > 0 && (
              <div className="flex overflow-x-auto gap-8 pb-10 snap-x no-scrollbar">
                {offers.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ZONA AHORRO Section */}
        <section id="zona-ahorro" className="pt-16 pb-8 px-6 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3 mb-10"
            >
              <BookOpen className="text-primary" size={32} />
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-primary">
                  ZONA AHORRO.
                </h3>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest mt-1">
                  Explora nuestro catálogo de ofertas
                </p>
              </div>
            </motion.div>

            {/* Catalog Carousel */}
            <div className="relative group max-w-7xl mx-auto mb-12">
              <div 
                ref={catalogScrollRef}
                className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12 px-4 md:px-8"
              >
                {CATALOG_IMAGES.map((image, index) => (
                  <motion.div
                    key={index}
                    className="flex-none w-[80%] md:w-[40%] lg:w-[23%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-primary/20 snap-center bg-surface-container-low cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setCatalogIndex(index);
                      setIsCatalogOpen(true);
                    }}
                  >
                    <img
                      src={image}
                      alt={`Oferta ${index + 5}`}
                      className="w-full h-full object-contain bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => scrollCatalog('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-background/80 hover:bg-primary/10 border border-primary/20 rounded-full text-primary backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scrollCatalog('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-background/80 hover:bg-primary/10 border border-primary/20 rounded-full text-primary backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Destacados */}
        <section id="catalogo" className="pt-10 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3 mb-12"
            >
              <Smartphone className="text-primary" size={32} />
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-primary">
                  Destacados
                </h3>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest mt-1">
                  Lo último en tecnología
                </p>
              </div>
            </motion.div>

            <div className="mt-12 mb-16 flex justify-center">
              <motion.img 
                src="/destacado-principal.jpg" 
                alt="Destacado Especial" 
                className="max-w-full md:max-w-xl rounded-3xl shadow-[0_0_40px_rgba(86,241,224,0.4)] border border-primary/20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Smartwatch Customization */}
        <section className="py-20 px-6 bg-surface-container-low/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-start gap-3 mb-12">
              <Watch className="text-primary mt-1" size={32} />
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-primary max-w-2xl leading-tight">
                  ¿Buscas personalizar tu smartwatch? En MAD tecno y mas vas a encontrar de todo!
                </h3>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest mt-2">
                  Gran variedad en mallas y accesorios
                </p>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-10 snap-x no-scrollbar">
              {smartwatches.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Services Title Section */}
      <section className="py-8 bg-background relative overflow-hidden border-t border-primary/5">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-black text-primary tracking-tighter drop-shadow-[0_0_15px_rgba(86,241,224,0.3)] text-center uppercase"
            >
              Nuestros Servicios
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ delay: 0.5, duration: 1 }}
              viewport={{ once: true }}
              className="h-1.5 bg-primary mt-4 rounded-full shadow-[0_0_15px_rgba(86,241,224,0.5)]"
            ></motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden border border-primary/20 shadow-[0_0_50px_rgba(86,241,224,0.15)] group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img 
              src="/servicios-banner.jpg" 
              alt="Nuestros Servicios" 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-surface-container-low border-t border-primary/10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <motion.img 
              src="/logo.png" 
              alt="MAD TECNO Y MAS" 
              className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
              referrerPolicy="no-referrer"
            />
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Tu destino tecnológico para los mejores gadgets, reparaciones y accesorios personalizados.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('zona-ahorro')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-xs font-bold text-primary hover:bg-primary/20 transition-all"
            >
              <BookOpen size={14} />
              ZONA AHORRO
            </motion.button>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold uppercase tracking-widest">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                <MessageCircle size={18} className="text-primary" />
                <a href="https://wa.me/3815341233">WhatsApp: 3815341233</a>
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                <Mail size={18} className="text-primary" />
                <a href="mailto:mad-tecnoymas-@gmail.com">mad-tecnoymas-@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <MapPin size={18} className="text-primary" />
                <span>Venta Online - Tucumán, Argentina</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold uppercase tracking-widest">Horarios</h4>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-on-surface-variant">
                Lunes a Viernes<br />
                <span className="text-primary font-bold">11:00 AM - 19:30 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Reviews Section */}
        <div className="max-w-7xl mx-auto mt-16 pt-16 border-t border-primary/10">
          <div className="text-center mb-10">
            <h4 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">Reseñas de Clientes</h4>
            <div className="flex justify-center gap-1 text-tertiary">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <motion.div 
                key={review.id}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-surface-container-highest/50 border border-primary/5 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="font-bold text-primary">{review.user}</div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-bold">{review.date}</div>
                </div>
                <div className="flex gap-0.5 mb-3 text-tertiary">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                      className={i < review.rating ? "" : "text-on-surface-variant/20"}
                    />
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-on-surface-variant/40">
          DESARROLLADO POR C DESIGN IA 2025 BY AI STUDIO GOOGLE.
        </div>
      </footer>

      <AIChat />
      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        initialIndex={catalogIndex}
      />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ReviewsModal isOpen={isReviewsOpen} onClose={() => setIsReviewsOpen(false)} />
    </div>
  );
}
