import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { CategoryName } from '../types/shop';

interface FooterProps {
  onSelectCategory: (category: CategoryName) => void;
  onNavigateHome: () => void;
}

type HelpTopic = {
  title: string;
  body: string;
};

const HELP_TOPICS: Record<string, HelpTopic> = {
  shipping: {
    title: 'Shipping & Delivery',
    body: 'Orders over $120 ship via complimentary express courier (2–4 business days). Standard orders ship for a flat $12 fee with live tracking once dispatched.',
  },
  returns: {
    title: 'Returns & 2-Year Warranty',
    body: 'Unworn or unused items may be returned within 30 days of delivery for a full exchange or refund. All ShopZayn electronics and watches carry a 2-year hardware guarantee.',
  },
  support: {
    title: 'Customer Support',
    body: 'Questions about sizing, compatibility, or bulk orders? Reach our team Monday–Saturday, 9:00 AM – 6:00 PM at care@shopzayn.example.',
  },
  phase1: {
    title: 'Storefront Preview Notice',
    body: 'This is Phase 1 of ShopZayn: a complete, responsive frontend storefront experience. No live payment processors or external customer databases are connected yet.',
  },
};

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTopic, setActiveTopic] = useState<HelpTopic | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2.5 text-xl font-bold text-white tracking-tight font-display"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect width="24" height="24" rx="5" fill="#1E293B" />
                <path
                  d="M7 8.5H17L8.5 15.5H17"
                  stroke="#3B82F6"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
              <span>ShopZayn</span>
            </button>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A modern multi-category retail destination bringing precision electronics,
              apparel, horology, and home design into one effortless storefront.
            </p>
          </div>

          {/* Categories Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Categories
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-2.5 gap-x-4 text-sm">
              {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category)}
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTopic(HELP_TOPICS.shipping)}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTopic(HELP_TOPICS.returns)}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Returns & Warranty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTopic(HELP_TOPICS.support)}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTopic(HELP_TOPICS.phase1)}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Demo Store Notice
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Member Releases
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Receive early access to seasonal drops and exclusive member discounts.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/60 rounded-lg px-3.5 py-2.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>Subscribed to ShopZayn updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Newsletter email address"
                  className="flex-1 min-w-0 h-10 px-3 text-sm text-white placeholder:text-slate-500 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 h-10 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopZayn Retail. All rights reserved.</p>
          <p>Use code ZAYN10 in your shopping bag for 10% off preview orders.</p>
        </div>
      </div>

      {/* Customer Care Info Modal */}
      {activeTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[2px]"
          onClick={() => setActiveTopic(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeTopic.title}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white text-slate-900 rounded-xl p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-lg font-bold text-slate-950 font-display">
                {activeTopic.title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveTopic(null)}
                aria-label="Close modal"
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {activeTopic.body}
            </p>
            <button
              type="button"
              onClick={() => setActiveTopic(null)}
              className="w-full py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
