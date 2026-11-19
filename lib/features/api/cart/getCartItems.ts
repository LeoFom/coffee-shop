import { CartItem } from "@/types/checkout.types";
import { mapCartItem } from "@/utils/addProductToCart";

export async function getCartItems(): Promise<CartItem[]> {
  try {
    const response = await fetch('/api/cart', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(mapCartItem)
      .filter((item): item is CartItem => item !== null);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_MODE === 'dev') {
      console.log('[GET] /api/cart error:', error);
    }
    return [];
  }
}
