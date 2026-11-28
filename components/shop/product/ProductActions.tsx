'use client'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ProductsType } from '@/types/products.types'
import { setCartItems } from '@/store/cart/cartSlice'
import { addProductToCart } from '@/utils/addProductToCart'
import { getCartItems } from '@/lib/features/api/cart/getCartItems'
import { toast } from 'sonner'

export default function ProductActions({ product }: { product: ProductsType }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()

    const result = await addProductToCart(product, quantity)

    if (result === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (result === 'ok') {
      try {
        dispatch(setCartItems(await getCartItems()))
      } catch {
        toast.error('Cart is temporarily unavailable. Please try again.')
      }
    }
  }

  return (
    <div className="mt-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-10 h-10 rounded-full bg-brand-brown/5"
        >
          -
        </button>

        <span className="text-lg font-medium">{quantity}</span>

        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="w-10 h-10 rounded-full bg-brand-brown/5"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-brand-brown text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
      >
        Add to Cart
      </button>
    </div>
  )
}
