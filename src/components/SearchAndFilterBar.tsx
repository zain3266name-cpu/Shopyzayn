import React from 'react';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { CategoryName, SortOption } from '../types/shop';

interface SearchAndFilterBarProps {
  searchQuery: string;
  activeCategory: CategoryName;
  sortBy: SortOption;
  resultCount: number;
  totalCount: number;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: CategoryName) => void;
  onSortChange: (sort: SortOption) => void;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  activeCategory,
  sortBy,
  resultCount,
  totalCount,
  searchInputRef,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="space-y-5 mb-8">
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search electronics, watches, apparel, skincare..."
            aria-label="Search products"
            className="w-full h-11 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap">
            Showing {resultCount} of {totalCount} items
          </span>

          <div className="relative inline-flex items-center">
            <ArrowUpDown
              className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort products"
              className="h-11 pl-8 pr-8 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            >
              <option value="featured">Sort: Featured</option>
              <option value="discount-desc">Biggest Discount</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2.5 min-h-[42px] text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isActive
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
