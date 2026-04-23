import { Product } from '@/types/products';

export default function ProductInfo({ product }: { product: Product }) {
  const finalPrice = product.isMemberDiscount
    ? product.price * 0.85
    : product.price;

  return (
    <div className="mb-6">
      <p className="text-sm text-brand-muted mb-2">
        {product.category} {product.roast && `• ${product.roast} Roast`}
      </p>

      <h1 className="font-serif text-4xl text-brand-brown mb-4">
        {product.name}
      </h1>

      <div className="flex items-end gap-3 mb-6">
        {product.isMemberDiscount ? (
          <>
            <span className="text-3xl font-bold text-brand-brown">
              ${finalPrice.toFixed(2)}
            </span>
            <span className="text-lg text-brand-muted line-through">
              ${product.price.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-brand-brown">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      <p className="text-brand-muted leading-relaxed">
        Freshly roasted coffee with rich aroma and balanced flavor.
        Perfect for daily brewing and special moments.
      </p>
    </div>
  );
}