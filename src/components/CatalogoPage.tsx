import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Filter } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useProductos } from '../hooks/useProductos';

interface CatalogPageProps {
  onClose: () => void;
  onAddToCart: (item: any) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onClose, onAddToCart }) => {
  const { productos, loading: productsLoading } = useProductos();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Obtener categorías únicas de los productos
  const categories = React.useMemo(() => {
    if (productsLoading || !productos.length) return [];
    
    const uniqueCategories = new Set(productos.map((p: any) => p.category).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [productos, productsLoading]);

  // Filtrar productos según categoría seleccionada
  const filteredProducts = React.useMemo(() => {
    if (!selectedCategory) return productos;
    return productos.filter((p: any) => p.category === selectedCategory);
  }, [productos, selectedCategory]);

  // Agrupar productos por categoría
  const groupedProducts = React.useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    
    productos.forEach((product: any) => {
      const category = product.category || 'Sin categoría';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });

    return grouped;
  }, [productos]);

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'oferta': '⚡',
      'destacado': '✨',
      'smartwatch/mallas': '⌚',
      'smartwatch': '⌚',
      'mallas': '⌚',
      'audio': '🔊',
      'herramientas': '🔧',
      'nuevo': '🆕',
      'electricidad': '⚡',
      'informática': '💻',
      'informatica': '💻',
      'accesorios': '🎁',
    };
    return emojiMap[category.toLowerCase()] || '📦';
  };

  const getCategoryLabel = (category: string) => {
    const labelMap: { [key: string]: string } = {
      'oferta': 'Zona de Ahorro',
      'destacado': 'Destacados',
      'smartwatch/mallas': 'Mallas de Reloj',
      'smartwatch': 'Mallas de Reloj',
      'mallas': 'Mallas de Reloj',
      'audio': 'Audio',
      'herramientas': 'Herramientas',
      'nuevo': 'Nuevos Productos',
      'electricidad': 'Electricidad',
      'informática': 'Informática',
      'informatica': 'Informática',
      'accesorios': 'Accesorios',
    };
    return labelMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-gradient-to-b from-background via-surface-container-highest to-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-container-highest/95 backdrop-blur border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/40 rounded-lg text-primary hover:bg-primary/20 transition-all font-bold"
          >
            <ChevronLeft size={18} />
            <span>Volver</span>
          </motion.button>
          
          <h1 className="text-3xl md:text-4xl font-black text-primary">
            Catálogo de Productos
          </h1>

          <div className="w-[140px]" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Category Filter (opcional) */}
        {categories.length > 1 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Filter size={20} />
              Filtrar por categoría
            </h2>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  selectedCategory === null
                    ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(86,241,224,0.4)]'
                    : 'bg-surface-container border border-primary/20 text-primary hover:border-primary/40'
                }`}
              >
                Todos ({productos.length})
              </motion.button>
              
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(86,241,224,0.4)]'
                      : 'bg-surface-container border border-primary/20 text-primary hover:border-primary/40'
                  }`}
                >
                  {getCategoryEmoji(category)} {getCategoryLabel(category)} ({groupedProducts[category]?.length || 0})
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid or Grouped View */}
        {selectedCategory ? (
          // Vista filtrada por categoría
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-primary mb-8 flex items-center gap-3">
                {getCategoryEmoji(selectedCategory)}
                {getCategoryLabel(selectedCategory)}
              </h2>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map((product: any, idx: number) => (
                    <ProductCard
                      key={idx}
                      product={product}
                      variant="grid"
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-on-surface-variant text-lg">
                    No hay productos en esta categoría
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista con todas las categorías
          <div className="space-y-16">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-on-surface-variant text-lg">
                  {productsLoading ? 'Cargando productos...' : 'No hay productos disponibles'}
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-black text-primary flex items-center gap-3">
                    {getCategoryEmoji(category)}
                    {getCategoryLabel(category)}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {groupedProducts[category]?.map((product: any, idx: number) => (
                      <ProductCard
                        key={idx}
                        product={product}
                        variant="grid"
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="text-primary font-bold hover:text-tertiary transition-colors text-sm"
                  >
                    Ver más {getCategoryLabel(category).toLowerCase()} →
                  </button>

                  <div className="border-b border-primary/10" />
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer padding */}
      <div className="h-12" />
    </motion.div>
  );
};