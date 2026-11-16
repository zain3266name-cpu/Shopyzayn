import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FREE_SHIPPING_THRESHOLD } from '../data/products';
import { CategoryName, Product } from '../types/shop';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  onBackToCatalog: () => void;
  onSelectCategory: (category: CategoryName) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    variantLabel: string,
    sizeLabel?: string
  ) => void;
  onBuyNow: (
    product: Product,
    quantity: number,
    variantLabel: string,
    sizeLabel?: string
  ) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  onBackToCatalog,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]?.label ?? 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping'>('overview');
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Reset selections whenever product changes
  useEffect(() => {
    setSelectedVariant(product.variants[0]?.label ?? 'Standard');
    setSelectedSize(product.sizes?.[0]);
    setQuantity(1);
    setActiveTab('overview');
    setAddedFeedback(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const savings = product.originalPrice - product.price;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant, selectedSize);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-600 transition-colors shrink-0 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => onSelectCategory(product.category)}
            className="hover:text-blue-600 transition-colors shrink-0 py-1"
          >
            {product.category}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Contiguous 2-Column Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <ResilientImage
                src={product.image}
                alt={product.name}
                fallbackLabel={product.name}
                className="w-full h-full"
              />
              {product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-mono font-semibold bg-blue-600 text-white rounded tabular-nums">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Key Quick Specs Strip below gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3.5"
                >
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    {spec.label}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider text-blue-600">
                  {product.brand}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" aria-hidden="true" />
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-tight font-display"
                style={{ textWrap: 'balance' }}
              >
                {product.name}
              </h1>

              {/* Price & Discount Row */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3 tabular-nums">
                <span className="text-3xl font-bold text-slate-950 font-display">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                      You save ${savings} ({product.discountPercent}%)
                    </span>
                  </>
                )}
              </div>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Variant / Finish Selection */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-semibold uppercase tracking-wider text-slate-500">
                  Finish / Edition
                </span>
                <span className="font-semibold text-slate-900">{selectedVariant}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const active = selectedVariant === variant.label;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant.label)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[42px] text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        active
                          ? 'border-blue-600 bg-blue-50/60 text-slate-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {variant.colorHex && (
                        <span
                          aria-hidden="true"
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      )}
                      <span>{variant.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection (if product has sizes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold uppercase tracking-wider text-slate-500">
                    Select Size
                  </span>
                  <span className="font-semibold text-slate-900">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[52px] px-3 py-2 min-h-[42px] text-xs font-semibold rounded-lg border transition-colors ${
                          active
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Primary Purchase CTAs */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 inline-flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-slate-950 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    aria-label="Increase quantity"
                    className="w-11 h-11 inline-flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs font-medium text-slate-600 tabular-nums">
                  {product.inStock
                    ? `In stock · ${product.stockCount} available`
                    : 'Out of stock'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    addedFeedback
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, quantity, selectedVariant, selectedSize)}
                  className="inline-flex items-center justify-center px-5 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Trust Guarantees */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {product.price * quantity >= FREE_SHIPPING_THRESHOLD
                    ? 'Qualifies for Free Express Shipping'
                    : `Free Express Shipping on orders over $${FREE_SHIPPING_THRESHOLD}`}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                <span>30-day complimentary returns & exchanges</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>2-year ShopZayn hardware & craftsmanship coverage</span>
              </div>
            </div>

            {/* Detailed Tabs */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4">
                {[
                  { id: 'overview', label: 'Highlights' },
                  { id: 'specs', label: 'Specs' },
                  { id: 'shipping', label: 'Delivery' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id as 'overview' | 'specs' | 'shipping')
                    }
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {product.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="py-2.5 flex justify-between gap-4">
                      <dt className="text-slate-500">{spec.label}</dt>
                      <dd className="font-medium text-slate-900 text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {activeTab === 'shipping' && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Orders placed before 2:00 PM local time dispatch the same business day.
                  Estimated arrival is 2–4 business days via tracked courier. Phase 1 demo
                  orders generate an instant confirmation preview without charging any card.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                  Continue Exploring
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
                  You May Also Appreciate
                </h2>
              </div>
              <button
                type="button"
                onClick={onBackToCatalog}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                View All Products
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelectProduct={onSelectProduct}
                  onQuickAdd={(p) =>
                    onAddToCart(p, 1, p.variants[0]?.label ?? 'Standard', p.sizes?.[0])
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};
