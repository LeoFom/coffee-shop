import Link from 'next/link';
import { Order, OrderStatus } from '@/types/orders.types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-brand-accent/20 text-brand-brown border-brand-accent',
  Paid: 'bg-green-100 text-green-800 border-green-200',
  Processing: 'bg-brand-accent/20 text-brand-brown border-brand-accent',
  Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  Delivered: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
  Refunded: 'bg-red-100 text-red-800 border-red-200',
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
};

function linePrice(unitPrice: number, discountPercent: number, quantity: number) {
  return unitPrice * (1 - discountPercent / 100) * quantity;
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-brand-brown/10">
        <p className="text-brand-muted mb-4">You haven&#39;t placed any orders yet.</p>
        <Link href="/shop" className="text-brand-brown font-medium hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-brand-brown/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="bg-brand-bg px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-brown/10">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
                  Order Number
                </p>
                <p className="font-medium text-brand-text">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="font-medium text-brand-text">
                  {new Date(order.placedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
                  Total
                </p>
                <p className="font-bold text-brand-brown">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <div>
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="p-6">
            <ul className="divide-y divide-brand-brown/5">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-card-sand rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-brand-brown/40 font-serif">
                        {item.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-brand-brown">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-brand-muted">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-brand-text">
                      $
                      {linePrice(
                        item.unitPrice,
                        item.discountPercent,
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
