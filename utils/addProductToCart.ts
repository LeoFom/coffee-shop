import { ProductsType } from "@/types/products.types";
import { CartItem } from "@/types/checkout.types";

type ProductPriceFields = ProductsType & {
  memberDiscountPercent?: number;
};

/** `memberDiscountPercent` (and leftover `discount`) is percent off, e.g. 10 = 10%. */
export function cartPriceAtAdding(product: ProductPriceFields): number {
  const price = Number(product.price);
  const percent = Number(product.memberDiscountPercent ?? product.discount ?? 0);

  if (!Number.isFinite(price)) {
    return 0;
  }

  if (!percent) {
    return price;
  }

  return Math.round(price * (1 - percent / 100) * 100) / 100;
}

export function mapCartItem(row: {
  id?: string;
  quantity?: number;
  priceAtAdding?: unknown;
  product?: ProductsType | null;
}): CartItem | null {
  if (!row?.id || !row.product) {
    return null;
  }

  return {
    id: row.id,
    product: row.product,
    quantity: Number(row.quantity) || 1,
    priceAtAdding: Number(row.priceAtAdding),
  };
}

export async function addProductToCart(
  product: ProductsType,
  quantity = 1,
): Promise<'ok' | 'unauthenticated' | 'error'> {
  const response = await fetch('/api/cart', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.id,
      quantity,
      priceAtAdding: cartPriceAtAdding(product),
    }),
  });

  if (response.status === 401) {
    return 'unauthenticated';
  }

  if (!response.ok) {
    return 'error';
  }

  return 'ok';
}
