import React from 'react';
import { Layers, ShieldCheck, Truck } from 'lucide-react';

const PILLARS = [
  {
    icon: Layers,
    title: '01. Seven Curated Categories',
    description:
      'From studio acoustics and Swiss-calibrated timepieces to tailored merino layers and botanical skincare, every item meets one cohesive standard.',
  },
  {
    icon: Truck,
    title: '02. Express Dispatch & Free Tier',
    description:
      'Same-day warehouse dispatch on orders before 2:00 PM with complimentary express delivery across every basket above $120.',
  },
  {
    icon: ShieldCheck,
    title: '03. Two-Year ShopZayn Guarantee',
    description:
      'Transparent seasonal pricing, straightforward 30-day returns, and dedicated coverage against material or craftsmanship defects.',
  },
];

export const StorySection: React.FC = () => {
  return (
    <section className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            The ShopZayn Standard
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight font-display"
            style={{ textWrap: 'balance' }}
          >
            Built for Focused Everyday Shopping
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-950 mb-2 font-display">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
