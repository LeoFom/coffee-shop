import {ProductsType} from "@/types/products.types";

export default function ProductInfo({ product }: { product: ProductsType }) {
  const finalPrice = product.discount
    ? product.price * 0.85
    : product.price;

  return (
    <div className="mb-6">
      <p className="text-sm text-brand-muted mb-2">
        {product.category} {product?.coffeeDetails?.roast && `• ${product?.coffeeDetails?.roast} Roast`}
      </p>

      <h1 className="font-serif text-4xl text-brand-brown mb-4">
        {product.name}
      </h1>

      <div className="flex items-end gap-3 mb-6">
        {product.discount ? (
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