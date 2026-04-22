'use client'; // Используем клиентский компонент для работы useState

import { useState, useMemo } from 'react';
import Container from '@/components/ui/Container';
import FilterSidebar from '@/components/shop/FilterSidebar';
import CatalogProductCard from '@/components/cards/CatalogProductCard';
import { MOCK_PRODUCTS } from '@/lib/data/mockProducts';

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [onlyMemberPerks, setOnlyMemberPerks] = useState(false);

  // Логика фильтрации
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchRoast = selectedRoasts.length === 0 || (product.roast && selectedRoasts.includes(product.roast));
      const matchMember = onlyMemberPerks ? product.isMemberDiscount : true;

      return matchCategory && matchRoast && matchMember;
    });
  }, [selectedCategories, selectedRoasts, onlyMemberPerks]);

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24">
      <Container>
        {/* Хедер каталога */}
        <div className="mb-12 border-b border-brand-brown/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Shop</h1>
          <p className="text-brand-muted max-w-2xl">
            Explore our freshly roasted beans, brewing equipment, and exclusive merchandise.
            Members get up to 15% off and free shipping.
          </p>
        </div>

        {/* Сетка: Сайдбар + Товары */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Левая сторона: Фильтры */}
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedRoasts={selectedRoasts}
            setSelectedRoasts={setSelectedRoasts}
            onlyMemberPerks={onlyMemberPerks}
            setOnlyMemberPerks={setOnlyMemberPerks}
          />

          {/* Правая сторона: Сетка товаров */}
          <div className="flex-1">
            {/* Панель сортировки / инфо (опционально) */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-brand-muted">
                Showing {filteredProducts.length} result{filteredProducts.length !== 1 && 's'}
              </span>
              <select className="bg-transparent border-none text-brand-brown font-medium outline-none cursor-pointer text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Грин с карточками */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <CatalogProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="w-full py-20 text-center border-2 border-dashed border-brand-brown/20 rounded-2xl">
                <h3 className="text-xl font-serif text-brand-brown mb-2">No products found</h3>
                <p className="text-brand-muted">Try adjusting your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedRoasts([]);
                    setOnlyMemberPerks(false);
                  }}
                  className="mt-4 text-brand-brown font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}