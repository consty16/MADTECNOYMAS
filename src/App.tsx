import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Smartphone, Watch, Zap, Sparkles, MessageCircle, Mail, MapPin, BookOpen, ShoppingCart, Star, ChevronLeft, ChevronRight, Play, Home, Settings, ExternalLink, Menu, X } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { AIChat } from './components/AIChat';
import { CatalogModal } from './components/CatalogModal';
import { CartModal } from './components/CartModal';
import { ReviewsModal } from './components/ReviewsModal';
import { ReviewsForm } from './components/ReviewsForm';
import { CATALOG_IMAGES, OFFER_BANNER_IMAGES, PRODUCTS, REEL_VIDEOS } from './constants';
import { useProductos } from './hooks/useProductos';
import { useReviews } from './hooks/useReviews';
import { useAdminAuth } from './hooks/useAdminAuth';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { CatalogPage } from './components/CatalogoPage';

export default function App() {
  const [isCatalogOpen, setIsCatalogOpen] = React.useState(false);
  const [catalogIndex, setCatalogIndex] = React.useState(0);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = React.useState(false);
  const [isCatalogPageOpen, setIsCatalogPageOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [cart, setCart] = React.useState<any[]>([]);
  const [adminError, setAdminError] = React.useState('');

  const handleAddToCart = (item: any) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: Math.min(10, updated[existingIndex].cantidad + item.cantidad)
        };
        return updated;
      }
      return [...prevCart, item];
    });
    setIsCartOpen(true);
  };
  // Estados para admin secreto
  const [isAdmin, setIsAdmin] = React.useState(() => {
    const isAdminPath = window.location.pathname === '/admin';
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    return isAdminPath && isAuthenticated;
  });

  const [isAdminLoginPage, setIsAdminLoginPage] = React.useState(() => {
    return window.location.pathname === '/admin' && localStorage.getItem('adminAuth') !== 'true';
  });

  React.useEffect(() => {
    const handlePopState = () => {
      const isAdminPath = window.location.pathname === '/admin';
      const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
      
      if (isAdminPath && isAuthenticated) {
        setIsAdmin(true);
        setIsAdminLoginPage(false);
      } else if (isAdminPath && !isAuthenticated) {
        setIsAdmin(false);
        setIsAdminLoginPage(true);
      } else {
        setIsAdmin(false);
        setIsAdminLoginPage(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const catalogScrollRef = React.useRef<HTMLDivElement>(null);
  const mallaScrollRef = React.useRef<HTMLDivElement>(null);

  const { productos, loading: productsLoading } = useProductos();
  const { reviews, loading: reviewsLoading } = useReviews();
  const { isLoggedIn, loading: authLoading, login, logout } = useAdminAuth();

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



  const offers = productsLoading ? PRODUCTS.filter(p => p.category === 'oferta') : productos.filter((p: any) => p.category === 'oferta');
  const featured = productsLoading ? PRODUCTS.filter(p => p.category === 'destacado') : productos.filter((p: any) => p.category === 'destacado');
  const smartwatches = (productsLoading
    ? PRODUCTS.filter(p => p.category === 'smartwatch')
    : [
        ...productos.filter((p: any) => p.category === 'smartwatch'),
        ...PRODUCTS.filter(p => p.category === 'smartwatch').filter(sp => 
          !productos.some((dp: any) => dp.nombre === sp.title || dp.imagen === sp.image)
        )
      ]).filter(p => {
        const img = (p.imagen || p.image || '').toLowerCase();
        return !img.includes('mallaabrojo') && !img.includes('mallamanual') && !img.includes('mallanaranjaduo');
      });

  return (
    <>
      {/* MOSTRAR LOGIN DE ADMIN */}
      {isAdminLoginPage && (
        <AdminLogin
          onLogin={() => {
            setIsAdmin(true);
            setIsAdminLoginPage(false);
          }}
        />
      )}

      {/* MOSTRAR PANEL DE ADMIN */}
      {isAdmin && (
        <AdminPanel
          onLogout={() => {
            setIsAdmin(false);
            setIsAdminLoginPage(false);
            window.location.href = '/';
          }}
        />
      )}

      {/* MOSTRAR TIENDA NORMAL (si NO está en admin) */}
      {!isAdmin && !isAdminLoginPage && (
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
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
                <span className="drop-shadow-[0_0_3px_rgba(86, 241, 224, 0.5)]">Carrito</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(86, 241, 224, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCatalogPageOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/40 rounded-lg text-primary hover:bg-primary/20 transition-all shadow-[0_0_20px_rgba(86, 241, 224, 0.4)] font-bold"
              >
                <Smartphone size={14} className="drop-shadow-[0_0_8px_rgba(86, 241, 224, 0.8)]" />
                <span className="drop-shadow-[0_0_3px_rgba(86, 241, 224, 0.5)]">Catálogo</span>
              </motion.button>
            </div>
          </nav>

          {/* Mobile Hamburguer button */}
          <div className="flex md:hidden items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-[#00142b] border border-primary rounded-lg text-primary hover:bg-[#001f3f] transition-all shadow-[0_0_20px_rgba(86, 241, 224, 0.4)] font-bold"
            >
              <Menu size={18} className="drop-shadow-[0_0_8px_rgba(86, 241, 224, 0.8)]" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Side Drawer outside of header to prevent backdrop-filter flattening/clipping */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-[#000e23]/80 backdrop-blur-md"
            />

            {/* Sidebar Draw Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-14 right-6 w-72 z-[101] border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(86,241,224,0.3)] p-5 flex flex-col gap-5"
              style={{ backgroundColor: '#00142b' }}
            >
              <div className="flex flex-col gap-4">
                {/* Header inside slider */}
                <div className="flex items-center justify-between">
                  <span className="text-primary font-black uppercase tracking-wider text-xs">Menú</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg bg-primary/10 text-primary border border-primary/30"
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {/* Navigation buttons inside slide layout */}
                <nav className="flex flex-col gap-3 text-xs font-bold uppercase tracking-widest">
                  {/* Catálogo button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsCatalogPageOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg text-primary text-left transition-all"
                  >
                    <Smartphone size={14} className="drop-shadow-[0_0_6px_rgba(86,241,224,0.6)]" />
                    <span>Catálogo</span>
                  </motion.button>

                  {/* Carrito button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg text-primary text-left transition-all"
                  >
                    <ShoppingCart size={14} className="drop-shadow-[0_0_6px_rgba(86,241,224,0.6)]" />
                    <span>Carrito</span>
                  </motion.button>

                  {/* Reviews button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsReviewsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 bg-[#ff00ff]/5 hover:bg-[#ff00ff]/10 border border-[#ff00ff]/20 rounded-lg text-[#ff00ff] text-left transition-all"
                  >
                    <Play size={14} fill="currentColor" className="drop-shadow-[0_0_6px_rgba(255,0,255,0.6)]" />
                    <span>Reviews</span>
                  </motion.button>

                  {/* Contacto button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const contactSec = document.getElementById('contacto');
                      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg text-primary text-left transition-all"
                  >
                    <MessageCircle size={14} className="drop-shadow-[0_0_6px_rgba(86,241,224,0.6)]" />
                    <span>Contacto</span>
                  </motion.button>
                </nav>
              </div>

              <div className="text-center text-[10px] text-on-surface-variant/40 font-semibold tracking-wider uppercase border-t border-primary/10 pt-3">
                © MAD TECNO Y MAS
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                Si necesitas reparar tu PC o reinstalar tu Office, ¡también cuenta con nosotros!
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
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
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
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hidden md:flex hover:bg-primary hover:text-on-primary"
                aria-label="Previous slide"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => scrollCatalog('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hidden md:flex hover:bg-primary hover:text-on-primary"
                aria-label="Next slide"
              >
                <ChevronRight size={28} />
              </button>

              {/* Mobile Arrows */}
              <div className="flex justify-center gap-6 mt-4 md:hidden">
                <button
                  onClick={() => scrollCatalog('left')}
                  className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scrollCatalog('right')}
                  className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
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
              <Watch className="text-primary mt-1 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-primary max-w-2xl leading-tight">
                  ¿Buscas personalizar tu smartwatch? En MAD tecno y mas vas a encontrar de todo!
                </h3>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest mt-2">
                  Gran variedad en mallas y accesorios
                </p>
              </div>
            </div>

            <div className="relative group/mallas w-full overflow-hidden">
              <div 
                ref={mallaScrollRef}
                className="flex gap-8 md:gap-12 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 scroll-smooth px-2"
              >
                {smartwatches.map(product => {
                  const isDbProd = product.id && isNaN(Number(product.id)); // true if firebase string id
                  const isOffer = product.category === 'oferta';
                  
                  // Safe price parsing
                  let displayPrice = '';
                  if (typeof product.precio === 'number') {
                    displayPrice = `$${product.precio.toLocaleString('es-AR')}`;
                  } else if (product.precio) {
                    displayPrice = `$${Number(product.precio).toLocaleString('es-AR')}`;
                  } else if (product.price) {
                    displayPrice = product.price.startsWith('$') ? product.price : `$${product.price}`;
                  }

                  return (
                    <motion.div
                      key={product.id}
                      whileHover={{ 
                        y: -12,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      className="group relative flex flex-col items-center justify-between min-w-[260px] md:min-w-[340px] max-w-[340px] snap-start bg-transparent select-none cursor-pointer"
                    >
                      {/* Responsive 1:1 Aspect Frame with premium dark-blue background */}
                      <div className="relative w-full aspect-square flex items-center justify-center p-6 bg-[#0c1a30]/80 hover:bg-[#0e2242]/90 border border-primary/20 hover:border-primary/40 rounded-3xl backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300">
                        <motion.img
                          whileHover={{ scale: 1.12 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          src={product.imagen || product.image}
                          alt={product.nombre || product.title}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(86,241,224,0.35)]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Malla';
                          }}
                          referrerPolicy="no-referrer"
                        />
                        {isOffer && (
                          <div className="absolute top-4 right-4 bg-tertiary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,81,250,0.4)]">
                            Oferta
                          </div>
                        )}
                      </div>

                      {/* Info & Call to Action text panel */}
                      <div className="mt-4 text-center flex flex-col gap-2 w-full px-4">
                        <h4 className="text-on-surface font-semibold text-base md:text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                          {product.nombre || product.title}
                        </h4>
                        <p className="text-primary font-extrabold text-base md:text-xl drop-shadow-[0_0_12px_rgba(86,241,224,0.3)]">
                          {displayPrice}
                        </p>
                        <button
                          onClick={() => {
                            const parsedPrecioNum = typeof product.precio === 'number' 
                              ? product.precio 
                              : Number(product.precio) || (product.price ? parseFloat(String(product.price).replace(/[^\d]/g, '')) : 0);

                            handleAddToCart({
                              id: product.id || product.nombre || product.title,
                              nombre: product.nombre || product.title,
                              precio: parsedPrecioNum,
                              imagen: product.imagen || product.image,
                              cantidad: 1,
                            });
                          }}
                          className="w-full mt-2 py-2.5 bg-primary/20 hover:bg-primary border border-primary/40 text-primary hover:text-on-primary rounded-xl font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(86,241,224,0.15)] hover:shadow-[0_0_30px_rgba(86,241,224,0.4)] uppercase"
                        >
                          <ShoppingCart size={14} className="group-hover:scale-110 transition-transform" />
                          COMPRAR
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation arrows for mallas carousel */}
              <button
                onClick={() => {
                  if (mallaScrollRef.current) {
                    mallaScrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
                  }
                }}
                className="absolute left-2 top-[40%] -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-primary/30 flex items-center justify-center text-primary shadow-lg opacity-0 group-hover/mallas:opacity-100 transition-all z-10 hover:bg-primary hover:text-on-primary cursor-pointer hidden md:flex"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => {
                  if (mallaScrollRef.current) {
                    mallaScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
                  }
                }}
                className="absolute right-2 top-[40%] -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-primary/30 flex items-center justify-center text-primary shadow-lg opacity-0 group-hover/mallas:opacity-100 transition-all z-10 hover:bg-primary hover:text-on-primary cursor-pointer hidden md:flex"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>

              {/* Mobile Arrows */}
              <div className="flex justify-center gap-6 mt-4 md:hidden">
                <button
                  onClick={() => {
                    if (mallaScrollRef.current) {
                      mallaScrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary active:scale-90 transition-transform animate-pulse-subtle"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => {
                    if (mallaScrollRef.current) {
                      mallaScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary active:scale-90 transition-transform animate-pulse-subtle"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </section>

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
      </main>

      {/* Footer con información de contacto y Reseñas */}
      <footer id="contacto" className="bg-surface-container-low border-t border-primary/10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
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
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
            >
              <BookOpen size={14} />
              ZONA AHORRO
            </motion.button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Contacto</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant/80">
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="text-primary" />
                <a href="https://wa.me/543815341233" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  +54 381 534-1233
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:admin@madtecno.com" className="hover:text-primary transition-colors">
                  admin@madtecno.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>Tucumán, Argentina</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary font-sans">Ubicación y Atención</h4>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed">
              Atención personalizada online y envíos express a todo el país.
            </p>
            <div className="text-xs text-on-surface-variant/60">
              <p className="font-semibold text-primary/80">Horarios:</p>
              <p>Lunes a Sábados: 9:00 - 13:00 hs. / 17:00 - 21:00 hs.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 my-12" />

        {/* User Reviews Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h4 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">Reseñas de Clientes</h4>
            <div className="flex justify-center gap-1 text-tertiary">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <motion.div 
                key={review.id}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-surface-container-highest/50 border border-primary/5 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="font-bold text-primary">{review.nombre}</div>
                </div>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">
                  "{review.comentario}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Formulario de Reseñas */}
          <ReviewsForm />
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-on-surface-variant/40">
          © 2026 MAD TECNO Y MAS. Todos los derechos reservados.
        </div>
      </footer>

      <AIChat />
      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        initialIndex={catalogIndex}
      />
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onCartChange={setCart}
      />
      <ReviewsModal isOpen={isReviewsOpen} onClose={() => setIsReviewsOpen(false)} />
      {isCatalogPageOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <CatalogPage 
            onClose={() => setIsCatalogPageOpen(false)}
            onAddToCart={handleAddToCart}
          />
        </div>
      )}
    </div>
    )}
  </>
  );
}