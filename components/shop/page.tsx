'use client';

import { useMemo, useState } from 'react';
import MyContainer from '@/components/ui/MyContainer';
import FilterSidebar from '@/components/shop/FilterSidebar';
import CatalogProductCard from '@/components/cards/CatalogProductCard';
import { cartPriceAtAdding } from '@/utils/addProductToCart';
import type { CategoryType, ProductsType, RoastType } from '@/types/products.types';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

interface ShopPageInterface {
  productsData: ProductsType[];
}

function hasMemberPerk(product: ProductsType) {
  const listPrice = Number(product.price);
  return cartPriceAtAdding(product) < listPrice;
}

export default function ShopPage({ productsData }: ShopPageInterface) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [selectedRoasts, setSelectedRoasts] = useState<RoastType[]>([]);
  const [onlyMemberPerks, setOnlyMemberPerks] = useState(false);
  const [sort, setSort] = useState<SortOption>('featured');

  const catalog = productsData;

  const filteredProducts = useMemo(() => {
    const list = catalog.filter((product) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const roast = product.coffeeDetails?.roast;
      const matchRoast =
        selectedRoasts.length === 0 ||
        (roast != null && selectedRoasts.includes(roast));
      const matchMember = onlyMemberPerks ? hasMemberPerk(product) : true;

      return matchCategory && matchRoast && matchMember;
    });

    if (sort === 'price-asc') {
      return [...list].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === 'price-desc') {
      return [...list].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return list;
  }, [catalog, selectedCategories, selectedRoasts, onlyMemberPerks, sort]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRoasts([]);
    setOnlyMemberPerks(false);
    setSort('featured');
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24">
      <MyContainer>
        <div className="mb-12 border-b border-brand-brown/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Shop</h1>
          <p className="text-brand-muted max-w-2xl">
            Explore our freshly roasted beans, brewing equipment, and exclusive merchandise.
            Members get up to 15% off and free shipping.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedRoasts={selectedRoasts}
            setSelectedRoasts={setSelectedRoasts}
            onlyMemberPerks={onlyMemberPerks}
            setOnlyMemberPerks={setOnlyMemberPerks}
          />

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-brand-muted">
                Showing {filteredProducts.length} result{filteredProducts.length !== 1 && 's'}
              </span>
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="bg-transparent border-none text-brand-brown font-medium outline-none cursor-pointer text-sm"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <CatalogProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="w-full py-20 text-center border-2 border-dashed border-brand-brown/20 rounded-2xl">
                <h3 className="text-xl font-serif text-brand-brown mb-2">No products found</h3>
                <p className="text-brand-muted">Try adjusting your filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-brand-brown font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </MyContainer>
    </div>
  );
}
