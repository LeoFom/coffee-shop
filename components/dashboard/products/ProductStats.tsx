'use client';

import { useSelector } from 'react-redux';
import DashboardCard from '../ui/DashboardCard';
import { selectProducts } from '@/store/products/productSelectors';

export default function ProductStats() {
  const products = useSelector(selectProducts) ?? [];
  const total = products.length;
  const withDiscount = products.filter((product) => (product.discount ?? 0) > 0).length;
  const averagePrice =
    total === 0
      ? 0
      : products.reduce((sum, product) => sum + (product.price ?? 0), 0) / total;

  const stats = [
    { label: 'Total Products', value: String(total) },
    { label: 'With Discount', value: String(withDiscount) },
    { label: 'Average Price', value: `$${averagePrice.toFixed(0)}` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <DashboardCard key={stat.label} className="p-6">
          <p className="text-sm text-brand-muted mb-2">{stat.label}</p>
          <h3 className="text-3xl font-serif font-bold text-brand-brown">{stat.value}</h3>
        </DashboardCard>
      ))}
    </div>
  );
}
