import ProductDetails from '@/components/shop/product/ProductDetails';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div>
      <ProductDetails slug={slug} />
    </div>
  );
}