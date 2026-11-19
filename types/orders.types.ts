export type OrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type OrderItemCategory = 'Coffee' | 'Equipment' | 'Merchandise';
export type OrderPaymentMethod = 'Card' | 'PayPal' | 'Cash';
export type OrderPaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItemSnapshot {
  id: string;
  productId: string | null;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  category: OrderItemCategory | string;
  unitPrice: number;
  discountPercent: number;
  quantity: number;
}

export interface OrderShippingAddress {
  firstName: string;
  lastName: string;
  phone: string | null;
  country: string;
  city: string;
  postalCode: string | null;
  addressLine1: string;
  addressLine2: string | null;
}

export interface OrderPayment {
  amount: number;
  method: OrderPaymentMethod | string;
  status: OrderPaymentStatus | string;
  transactionId: string | null;
  provider: string | null;
  paidAt: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  email: string;
  phone: string | null;
  subtotalAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes: string | null;
  currency: string;
  placedAt: string;
  items: OrderItemSnapshot[];
  shippingAddress: OrderShippingAddress | null;
  payment: OrderPayment | null;
}
