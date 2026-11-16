import React, { useState } from 'react';
import { Check, Plus, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types/shop';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
    >
      {/* Image Area (~68% visual height, uniform 4:3 aspect ratio) */}
      <div
        onClick={() => onSelectProduct(product)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectProduct(product);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
        className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600"
      >
        <ResilientImage
          src={product.image}
          alt={product.name}
          fallbackLabel={product.name}
          className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Maximum 1 clean editorial discount tag */}
        {product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-mono font-semibold bg-blue-600 text-white rounded tabular-nums">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Product Metadata & Actions */}
      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
              {product.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" aria-hidden="true" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left w-full focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
          >
            <h3 className="text-base font-semibold text-slate-950 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1 font-display">
              {product.name}
            </h3>
          </button>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.brand}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-bold text-slate-950 font-display">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              justAdded
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-white hover:bg-blue-600'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};
