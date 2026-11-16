import React from 'react';
import { ArrowLeft, SearchX } from 'lucide-react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data/products';
import { CategoryName, Product, SortOption } from '../types/shop';
import { ProductCard } from './ProductCard';
import { SearchAndFilterBar } from './SearchAndFilterBar';

interface CategoryPageViewProps {
  activeCategory: CategoryName;
  searchQuery: string;
  sortBy: SortOption;
  filteredProducts: Product[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onNavigateHome: () => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: CategoryName) => void;
  onSortChange: (sort: SortOption) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onResetFilters: () => void;
}

const CATEGORY_COPY: Record<
  CategoryName,
  { eyebrow: string; title: string; subtitle: string }
> = {
  All: {
    eyebrow: 'Full Storefront Directory',
    title: 'All ShopZayn Collections',
    subtitle:
      'Browse every curated piece across electronics, fashion, watches, home & kitchen, beauty, accessories, and sports.',
  },
  Electronics: {
    eyebrow: 'Audio & Acoustic Hardware',
    title: 'Electronics Collection',
    subtitle:
      'Studio-grade noise-cancelling headphones and 360-degree spatial speakers engineered for clarity and daily endurance.',
  },
  Fashion: {
    eyebrow: 'Apparel & Architectural Footwear',
    title: 'Fashion Collection',
    subtitle:
      'Tailored Italian double-faced wool layers and full-grain calfskin sneakers built for clean everyday silhouettes.',
  },
  'Home & Kitchen': {
    eyebrow: 'Interiors & Barista Craft',
    title: 'Home & Kitchen Collection',
    subtitle:
      'Precision PID espresso hardware and hand-blown opal architectural lighting designed to anchor modern living spaces.',
  },
  Beauty: {
    eyebrow: 'Clinical Botanical Skincare',
    title: 'Beauty Collection',
    subtitle:
      'Dermatologist-tested peptide concentrates and fragrance-free barrier formulas housed in UV-shielding glass.',
  },
  Watches: {
    eyebrow: 'Precision Horology',
    title: 'Watches Collection',
    subtitle:
      'Brushed 316L stainless steel chronographs with domed sapphire crystal and Swiss-calibrated automatic movements.',
  },
  Accessories: {
    eyebrow: 'Everyday Carry & Optics',
    title: 'Accessories Collection',
    subtitle:
      'Weatherproof 1680D ballistic nylon commuter packs and handcrafted Japanese acetate polarized sunglasses.',
  },
  Sports: {
    eyebrow: 'Endurance & Training Gear',
    title: 'Sports Collection',
    subtitle:
      'Dual-frequency titanium GPS fitness instrumentation and vacuum-insulated hydration gear for high-output training.',
  },
};

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  activeCategory,
  searchQuery,
  sortBy,
  filteredProducts,
  searchInputRef,
  onNavigateHome,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onSelectProduct,
  onQuickAdd,
  onResetFilters,
}) => {
  const copy = CATEGORY_COPY[activeCategory];

  return (
    <motion.div
      key={activeCategory}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white min-h-[70vh]"
    >
      {/* Dedicated Page Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-5"
          >
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-600 transition-colors py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-950 font-medium">{copy.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                {copy.eyebrow}
              </p>
              <h1
                className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight font-display"
                style={{ textWrap: 'balance' }}
              >
                {copy.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {copy.subtitle}
              </p>
            </div>

            <div className="text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap shrink-0">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
            </div>
          </div>
        </div>
      </section>

      {/* Search, Filter & Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SearchAndFilterBar
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          sortBy={sortBy}
          resultCount={filteredProducts.length}
          totalCount={PRODUCTS.length}
          searchInputRef={searchInputRef}
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
          onSortChange={onSortChange}
        />

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-5 h-5 text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-950 mb-1 font-display">
              No matching products found
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              We couldn’t find any items matching “{searchQuery}” in {activeCategory}.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="px-5 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
};
