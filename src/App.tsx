/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, SearchX } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CartDrawer } from './components/CartDrawer';
import { CategoryPageView } from './components/CategoryPageView';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { StorySection } from './components/StorySection';
import { CATEGORIES, PRODUCTS } from './data/products';
import { CartItem, CategoryName, Product, SortOption } from './types/shop';

const CART_STORAGE_KEY = 'shopzayn_cart_v1';

type PageRoute = 'home' | 'category' | 'product';

function categoryToSlug(category: CategoryName): string {
  if (category === 'All') return 'all';
  return category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
}

function slugToCategory(slug: string): CategoryName {
  const match = CATEGORIES.find((c) => categoryToSlug(c) === slug);
  return match ?? 'All';
}

function parseUrlState(): {
  page: PageRoute;
  category: CategoryName;
  product: Product | null;
} {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path === '') {
    return { page: 'home', category: 'All', product: null };
  }
  if (path === '/catalog') {
    return { page: 'category', category: 'All', product: null };
  }
  if (path.startsWith('/category/')) {
    const slug = path.replace('/category/', '');
    return { page: 'category', category: slugToCategory(slug), product: null };
  }
  if (path.startsWith('/product/')) {
    const slug = path.replace('/product/', '');
    const found = PRODUCTS.find((p) => p.slug === slug) ?? null;
    if (found) {
      return { page: 'product', category: found.category, product: found };
    }
  }
  return { page: 'home', category: 'All', product: null };
}

export default function App() {
  const initialRoute = useMemo(() => parseUrlState(), []);

  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [activeCategory, setActiveCategory] = useState<CategoryName>(
    initialRoute.category
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialRoute.product
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Sync browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const next = parseUrlState();
      setCurrentPage(next.page);
      setActiveCategory(next.category);
      setSelectedProduct(next.product);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors in restricted environments
    }
  }, [cartItems]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'discount-desc':
        sorted.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return sorted;
  }, [activeCategory, searchQuery, sortBy]);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    const sameCategory = PRODUCTS.filter(
      (p) => p.id !== selectedProduct.id && p.category === selectedProduct.category
    );
    const others = PRODUCTS.filter(
      (p) => p.id !== selectedProduct.id && p.category !== selectedProduct.category
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [selectedProduct]);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const navigateToHome = useCallback(() => {
    setCurrentPage('home');
    setSelectedProduct(null);
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToCategoryPage = useCallback(
    (category: CategoryName, nextSort: SortOption = 'featured') => {
      setCurrentPage('category');
      setSelectedProduct(null);
      setActiveCategory(category);
      setSearchQuery('');
      setSortBy(nextSort);
      const targetPath =
        category === 'All' ? '/catalog' : `/category/${categoryToSlug(category)}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const navigateToProductPage = useCallback((product: Product) => {
    setCurrentPage('product');
    setSelectedProduct(product);
    setActiveCategory(product.category);
    const targetPath = `/product/${product.slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = (
    product: Product,
    quantity = 1,
    variantLabel?: string,
    sizeLabel?: string
  ) => {
    const resolvedVariant = variantLabel || product.variants[0]?.label || 'Standard';
    const resolvedSize = sizeLabel ?? product.sizes?.[0];
    const itemKey = `${product.id}__${resolvedVariant}__${resolvedSize ?? ''}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.key === itemKey
            ? { ...item, quantity: Math.min(product.stockCount, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          product,
          variantLabel: resolvedVariant,
          sizeLabel: resolvedSize,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} to bag`);
  };

  const handleBuyNow = (
    product: Product,
    quantity: number,
    variantLabel: string,
    sizeLabel?: string
  ) => {
    handleAddToCart(product, quantity, variantLabel, sizeLabel);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(item.product.stockCount, item.quantity + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    if (currentPage === 'category' && window.location.pathname !== '/catalog') {
      window.history.pushState({}, '', '/catalog');
    }
    searchInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-950">
      <Navbar
        currentPage={currentPage}
        activeCategory={activeCategory}
        cartCount={totalCartCount}
        onSelectCategory={(category) => navigateToCategoryPage(category)}
        onNavigateHome={navigateToHome}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'product' && selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            relatedProducts={relatedProducts}
            onBackToCatalog={() => navigateToCategoryPage('All')}
            onSelectCategory={(category) => navigateToCategoryPage(category)}
            onSelectProduct={navigateToProductPage}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : currentPage === 'category' ? (
          <CategoryPageView
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            filteredProducts={filteredProducts}
            searchInputRef={searchInputRef}
            onNavigateHome={navigateToHome}
            onSearchChange={setSearchQuery}
            onCategoryChange={(category) => navigateToCategoryPage(category, sortBy)}
            onSortChange={setSortBy}
            onSelectProduct={navigateToProductPage}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <>
            <HeroSection
              onExploreCatalog={() => navigateToCategoryPage('All')}
              onViewFeaturedDeals={() => navigateToCategoryPage('All', 'discount-desc')}
              onInspectFlagshipProduct={() => {
                const flagship =
                  PRODUCTS.find((p) => p.id === 'sz-watch-01') ?? PRODUCTS[0];
                navigateToProductPage(flagship);
              }}
            />

            {/* Home Page Featured Products & Quick Search */}
            <section
              id="featured"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1.5">
                    Featured Collection
                  </p>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight font-display"
                    style={{ textWrap: 'balance' }}
                  >
                    Signature Picks Across 7 Categories
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigateToCategoryPage('All')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                >
                  <span>Open Full Catalog Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <SearchAndFilterBar
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                sortBy={sortBy}
                resultCount={filteredProducts.length}
                totalCount={PRODUCTS.length}
                searchInputRef={searchInputRef}
                onSearchChange={setSearchQuery}
                onCategoryChange={(category) => navigateToCategoryPage(category, sortBy)}
                onSortChange={setSortBy}
              />

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={navigateToProductPage}
                      onQuickAdd={(p) => handleAddToCart(p, 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl py-16 px-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
                    <SearchX className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 mb-1 font-display">
                    No matching products found
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                    We couldn’t find any items matching “{searchQuery}”.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </section>

            <StorySection />
          </>
        )}
      </main>

      <Footer
        onSelectCategory={(category) => navigateToCategoryPage(category)}
        onNavigateHome={navigateToHome}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onInspectProduct={navigateToProductPage}
      />

      {/* Non-intrusive Add-to-Cart Toast Notification */}
      <AnimatePresence>
        {toastMessage && !cartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-4 right-4 left-4 sm:left-auto z-40 sm:max-w-sm bg-slate-950 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">
                {toastMessage}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setCartOpen(true);
              }}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
