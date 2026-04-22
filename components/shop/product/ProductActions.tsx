'use client';

import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { Product } from '@/types/productsTypes';
import { useState } from 'react';

export default function ProductActions({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const finalPrice = product.isMemberDiscount
    ? product.price * 0.85
    : product.price;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ product, price: finalPrice }));
    }
  };

  return (
    <div className="mt-auto">

      {/* Quantity */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="w-10 h-10 rounded-full bg-brand-brown/5"
        >
          -
        </button>

        <span className="text-lg font-medium">{quantity}</span>

        <button
          onClick={() => setQuantity(q => q + 1)}
          className="w-10 h-10 rounded-full bg-brand-brown/5"
        >
          +
        </button>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className="w-full bg-brand-brown text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}