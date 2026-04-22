'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ProductActions from './ProductActions';
import ProductInfo from './ProductInfo';

interface Props {
  slug: string;
}

export default function ProductDetails({ slug }: Props) {
  const product = useSelector((state: RootState) =>
    state.products.items.find(p => p.slug === slug)
  );

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  return (
    <div className="bg-brand-bg min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-card-sand rounded-3xl h-[500px] flex items-center justify-center relative">
          <span className="text-brand-brown/40 font-serif text-xl">
            {product.category}
          </span>

          {product.isMemberDiscount && (
            <div className="absolute top-4 left-4 bg-brand-brown text-white text-xs px-3 py-1 rounded-full font-bold">
              Member Perk
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <ProductInfo product={product} />
          <ProductActions product={product} />
        </div>

      </div>
    </div>
  );
}