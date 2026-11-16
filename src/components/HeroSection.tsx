import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_BANNER_IMAGE } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onViewFeaturedDeals: () => void;
  onInspectFlagshipProduct: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onViewFeaturedDeals,
  onInspectFlagshipProduct,
}) => {
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Editorial Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:p-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
                Curated Multi-Category Storefront
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-950 leading-[1.12] mb-4"
                style={{ textWrap: 'balance' }}
              >
                Precision Essentials for Modern Living.
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-md mb-8">
                Discover thoughtfully engineered electronics, tailored apparel, horology,
                botanical skincare, and everyday carry curated in one clean storefront.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExploreCatalog}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onViewFeaturedDeals}
                  className="inline-flex items-center justify-center px-5 py-3 min-h-[44px] text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  Top Discounts
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
              <span>Free Shipping $120+</span>
              <span aria-hidden="true">·</span>
              <span>30-Day Returns</span>
              <span aria-hidden="true">·</span>
              <span>2-Year Warranty</span>
            </div>
          </motion.div>

          {/* Studio Showcase Visual Column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative rounded-xl overflow-hidden border border-slate-200 min-h-[260px] sm:min-h-[360px] lg:min-h-[440px]"
          >
            <ResilientImage
              src={HERO_BANNER_IMAGE}
              alt="ShopZayn flagship showcase featuring matte black wireless headphones, stainless steel chronograph watch, and polarized sunglasses"
              fallbackLabel="ShopZayn Flagship Collection"
              className="w-full h-full lg:absolute lg:inset-0"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-blue-300 uppercase tracking-wider mb-1">
                  Featured Edit
                </p>
                <p className="text-lg sm:text-xl font-semibold text-white font-display">
                  Meridian ANC & Horizon Chronograph
                </p>
              </div>
              <button
                type="button"
                onClick={onInspectFlagshipProduct}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-xs font-semibold text-slate-950 bg-white hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Inspect Flagship</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
