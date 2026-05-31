import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../constants';

interface ProductCardProps {
  product: Product | any;
  variant?: 'default' | 'compact' | 'grid';
  onAddToCart?: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  variant = 'default',
  onAddToCart 
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id || product.nombre,
        nombre: product.nombre || product.title,
        precio: product.precio || product.price,
        imagen: product.imagen || product.image,
        cantidad: 1,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={
        variant === 'grid'
          ? "group relative flex flex-col w-full min-w-0 snap-start"
          : "group relative flex flex-col min-w-[280px] md:min-w-[350px] snap-start"
      }
    >
      <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-surface-container-highest neon-glow transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(86,241,224,0.4)] group-hover:border-primary/50 aspect-square flex items-center justify-center p-2">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={product.imagen || product.image}
          alt={product.nombre || product.title}
          className="w-[85%] h-[85%] object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Producto';
          }}
          referrerPolicy="no-referrer"
        />
        {product.isOffer && (
          <div className="absolute top-4 right-4 bg-tertiary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,81,250,0.4)]">
            Oferta
          </div>
        )}
      </div>

      <div className="mt-4 text-center flex flex-col gap-3">
        <h4 className="text-on-surface-variant font-medium text-sm md:text-base">
          {product.nombre || product.title}
        </h4>
        {product.description && (
          <p className="text-xs text-on-surface-variant/60 italic">
            {product.description}
          </p>
        )}
        <p className="text-primary font-bold text-lg">
          ${(product.precio || product.price)?.toLocaleString('es-AR')}
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(86,241,224,0.2)]"
        >
          <ShoppingCart size={14} />
          COMPRAR
        </button>
      </div>
    </motion.div>
  );
};
