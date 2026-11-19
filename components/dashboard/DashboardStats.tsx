import Link from 'next/link';
import type { Order } from '@/types/orders.types';

export type DashboardOverviewStats = {
  totalSpent: number;
  totalOrders: number;
  cartItemCount: number;
  recentOrders: Order[];
};

export default function DashboardStats({
  totalSpent,
  totalOrders,
  cartItemCount,
  recentOrders,
}: DashboardOverviewStats) {
  const stats = [
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}` },
    { label: 'Total Orders', value: String(totalOrders) },
    { label: 'Saved to Cart', value: String(cartItemCount) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-brand-muted mb-2">{stat.label}</p>
            <h3 className="text-3xl font-serif font-bold text-brand-brown">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-brand-brown/10 overflow-hidden shadow-sm">
        <div className="bg-card-sand px-6 py-4 border-b border-brand-brown/10 flex items-center justify-between">
          <h3 className="font-serif font-bold text-brand-brown text-lg">Recent Orders</h3>
          <Link href="/orders" className="text-sm font-medium text-brand-brown hover:underline">
            View all
          </Link>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-brand-muted">
              No orders yet.{' '}
              <Link href="/shop" className="text-brand-brown font-medium hover:underline">
                Start shopping
              </Link>
            </p>
          ) : (
            <ul className="space-y-4">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-brand-text text-sm">
                      <span className="font-medium">{order.orderNumber}</span>
                      {' · '}
                      {order.status}
                    </p>
                  </div>
                  <div className="text-xs text-brand-muted whitespace-nowrap">
                    ${order.totalAmount.toFixed(2)}
                    {' · '}
                    {new Date(order.placedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
