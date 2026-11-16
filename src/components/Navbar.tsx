import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { CategoryName } from '../types/shop';

interface NavbarProps {
  currentPage: 'home' | 'category' | 'product';
  activeCategory: CategoryName;
  cartCount: number;
  onSelectCategory: (category: CategoryName) => void;
  onNavigateHome: () => void;
  onOpenCart: () => void;
}

const DESKTOP_NAV_ITEMS: { label: string; category: CategoryName }[] = [
  { label: 'Catalog', category: 'All' },
  { label: 'Electronics', category: 'Electronics' },
  { label: 'Fashion', category: 'Fashion' },
  { label: 'Watches', category: 'Watches' },
  { label: 'Home & Kitchen', category: 'Home & Kitchen' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activeCategory,
  cartCount,
  onSelectCategory,
  onNavigateHome,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: CategoryName) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-950 whitespace-nowrap shrink-0 font-display focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="24" height="24" rx="5" fill="#0B0F19" />
              <path
                d="M7 8.5H17L8.5 15.5H17"
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
            <span>ShopZayn</span>
          </button>
        </div>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {DESKTOP_NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === 'category' && activeCategory === item.category;
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => handleCategoryClick(item.category)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2.5 px-4 py-2 min-h-[42px] text-sm font-semibold text-white bg-slate-950 hover:bg-blue-600 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={`Open shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Bag</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-mono font-semibold bg-blue-600 text-white rounded tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pages & Categories
            </p>
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className={`text-xs font-semibold px-2.5 py-1 rounded ${
                currentPage === 'home'
                  ? 'bg-slate-950 text-white'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => {
              const isActive =
                currentPage === 'category' && activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`text-left px-3.5 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap truncate ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {category === 'All' ? 'All Catalog' : category}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
