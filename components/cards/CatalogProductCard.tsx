'use client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import {ProductsType} from "@/types/products.types";
import Image from "next/image";

interface CatalogProductCardProps {
  product: ProductsType;
}

export default function CatalogProductCard({ product }: CatalogProductCardProps) {
  const dispatch = useDispatch();

  const finalPrice = Number(product.discount) ? Number(product.price) * Number(product.discount) : Number(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log("handleAddToCart CLICK")
    e.preventDefault();
    dispatch(addToCart({ product, price: 1000 }));
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group border border-brand-brown/10 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
      <div className="relative bg-card-sand w-full h-56 flex items-center justify-center">
        <span className="text-brand-brown/40 font-serif font-medium">{product.category}</span>

        <Image
          src={product.imageUrl ?? ''}
          alt={product.name ?? `Product ${product.id}`}
          loading="eager"
          sizes={'1'}
          fill
        />
        {/*{product.isMemberDiscount && (*/}
        {/*  <div className="absolute top-3 left-3 bg-brand-brown text-white text-xs px-2 py-1 rounded-full font-bold">*/}
        {/*    Member Perk*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <p className="text-xs text-brand-muted mb-1">{product.category} {product?.coffeeDetails?.roast && `• ${product?.coffeeDetails?.roast} Roast`}</p>
          <h3 className="font-serif font-bold text-brand-brown text-lg leading-tight">{product.name}</h3>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-end gap-2">
            {Number(product?.discount) ? (
              <>
                <span className="text-2xl font-bold text-brand-brown">${finalPrice.toFixed(2)}</span>
                <span className="text-sm text-brand-muted line-through mb-1">${Number(product?.price)?.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-brand-brown">${Number(product?.price).toFixed(2)}</span>
            )}
          </div>

          {/* Кнопка добавления в корзину */}
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-brand-brown/5 text-brand-brown hover:bg-brand-brown hover:text-white transition-colors flex items-center justify-center"
            aria-label="Add to cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}