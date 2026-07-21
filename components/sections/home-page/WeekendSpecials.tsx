'use client'; // Директива для работы стейта (табов) на клиенте
import { useState } from 'react';
import MyContainer from '@/ui/MyContainer';
import SpecialProductCard from '@/components/cards/SpecialProductCard';

const TABS = ['Accessories', 'Coffee beans', 'Apparel', 'Instant Coffee', 'Boundle'];

const SPECIAL_PRODUCTS = [
  { id: 1, title: 'Miele CM6 Thermal Carafe', oldPrice: 34, newPrice: 12, discount: '%20', imageUrl: '/carafe.png' },
  { id: 2, title: 'NEW . Ember Cup', oldPrice: 9.66, newPrice: 6.48, discount: '%20', imageUrl: '/cup.png' },
  { id: 3, title: 'Espro P3 French Press', oldPrice: 6.88, newPrice: 5.22, discount: '%20', imageUrl: '/press.png' },
];

export default function WeekendSpecials() {
  const [activeTab, setActiveTab] = useState('Accessories');

  return (
    <section className="py-24 bg-brand-bg">
      <MyContainer>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-brown mb-4">Weekend special products</h2>
          <p className="text-brand-muted">Check out our daily special product that you can get with +%20 OFF!</p>
        </div>

        {/* Навигация (Табы) */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-brand-brown/10 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 relative text-sm font-medium transition-colors ${
                activeTab === tab ? 'text-brand-brown' : 'text-brand-muted hover:text-brand-brown'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-brown rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPECIAL_PRODUCTS.map((product) => (
            <SpecialProductCard key={product.id} {...product} />
          ))}
        </div>
      </MyContainer>
    </section>
  );
}