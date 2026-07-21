import ProductActions from './ProductActions';
import ProductInfo from './ProductInfo';
import {getProductsBySlug} from "@/lib/features/api/products/getProductsBySlug";
import Image from "next/image";
import MyContainer from "@/ui/MyContainer";

interface Props {
  slug: string;
}

export default async function ProductDetails({ slug }: Props) {
  const product = await getProductsBySlug(slug)

  if (!product) {
    return <div className="p-10">{`Product not found ${slug}`}</div>;
  }

  return (
    <div className="bg-brand-bg min-h-screen px-6 pt-20 pb-10">
      <MyContainer className="flex items-center justify-between gap-20">
        <div className="relative bg-card-sand rounded-3xl h-[450px] w-[500px] flex items-center justify-center">
          <span className="text-brand-brown/40 font-serif text-xl">
            {product?.imageUrl &&
              <Image
                src={product?.imageUrl ?? '/'}
                alt={product?.name ??  ""}
                fill
                objectFit={'cover'}
              />
            }
          </span>

          {product.discount && (
            <div className="absolute top-4 left-4 bg-brand-brown text-white text-xs px-3 py-1 rounded-full font-bold">
              Member Perk
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <ProductInfo product={product} />
          <ProductActions product={product} />
        </div>
      </MyContainer>
    </div>
  );
}