import OrdersList from '@/components/dashboard/OrdersList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders | Coffeo',
  description: 'View your Coffeo order history',
};

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">Order History</h1>
        <p className="text-brand-muted">Check the status of your recent orders or view past purchases.</p>
      </div>

      <OrdersList />
    </div>
  );
}