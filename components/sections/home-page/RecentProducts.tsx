import MyContainer from '@/ui/MyContainer';
import ProductCard from '@/cards/ProductCard';

const DUMMY_PRODUCTS = [
  { id: 1, title: 'Spice iceland blend', category: 'Blend', price: 12, bgColor: '#F2E8E8', imageUrl: '/placeholder.png' },
  { id: 2, title: 'Hair blender', category: 'Blend', price: 12, bgColor: '#F6DBE0', imageUrl: '/placeholder.png' },
  { id: 3, title: 'Col brew blend', category: 'Blend', price: 16, bgColor: '#EAE1D0', imageUrl: '/placeholder.png' },
  { id: 4, title: 'Honduras El Puente', category: 'Single origin', price: 80, bgColor: '#7E8085', imageUrl: '/placeholder.png' },
];

export default function RecentProducts() {
  return (
    <section className="py-24 bg-white">
      <MyContainer>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-brand-brown mb-4">Explore the recent products</h2>
          <p className="text-brand-muted max-w-2xl mx-auto">
            Our delectable drink options, including classic espresso choices, house specialties, fruit smoothies and frozen treats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </MyContainer>
    </section>
  );
}