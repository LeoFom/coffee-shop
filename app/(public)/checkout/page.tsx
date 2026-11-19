'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import MyContainer from '@/components/ui/MyContainer';
import ContactDetailsSection from '@/components/checkout/ContactDetailsSection';
import DeliverySection from '@/components/checkout/DeliverySection';
import PaymentSection from '@/components/checkout/PaymentSection';
import CommentSection from '@/components/checkout/CommentSection';
import OrderSummary from '@/components/checkout/OrderSummary';
import { CheckoutFormState, initialCheckoutState } from '@/types/checkout.types';
import { RootState } from '@/store/store';
import { setCartItems } from '@/store/cart/cartSlice';
import { handleRequestNotification } from '@/lib/handler/handleRequestNotification';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const [form, setForm] = useState<CheckoutFormState>(initialCheckoutState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.contact.firstName) newErrors.firstName = "Вкажіть ім'я";
    if (!form.contact.lastName) newErrors.lastName = 'Вкажіть прізвище';
    if (!/^\+?380\d{9}$/.test(form.contact.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Невірний формат телефону';
    }
    if (
      form.contact.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email)
    ) {
      newErrors.email = 'Невірний формат email';
    }

    if (form.delivery.method !== 'courier') {
      if (!form.delivery.city) newErrors.city = 'Оберіть місто';
      if (!form.delivery.warehouse) newErrors.warehouse = 'Оберіть відділення';
    } else if (!form.delivery.address) {
      newErrors.address = 'Вкажіть адресу';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (cartItems.length === 0) {
      toast.warning('Кошик порожній');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: form.contact,
          delivery: form.delivery,
          payment: form.payment,
          comment: form.comment,
        }),
      });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = { message: 'Не вдалося оформити замовлення' };
      }

      handleRequestNotification(res, data, {
        successMessage: 'Замовлення оформлено',
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login');
        }
        return;
      }

      dispatch(setCartItems([]));
      router.push('/orders');
    } catch {
      toast.error('Не вдалося оформити замовлення');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24">
      <MyContainer>
        <div className="mb-12 border-b border-brand-brown/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">
            Оформлення замовлення
          </h1>
          <p className="text-brand-muted max-w-2xl">
            Заповніть дані нижче, щоб завершити ваше замовлення.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <ContactDetailsSection
              data={form.contact}
              onChange={(contact) => setForm({ ...form, contact })}
              errors={{
                firstName: errors.firstName,
                lastName: errors.lastName,
                phone: errors.phone,
                email: errors.email,
              }}
            />

            <DeliverySection
              data={form.delivery}
              onChange={(delivery) => setForm({ ...form, delivery })}
              errors={{
                city: errors.city,
                warehouse: errors.warehouse,
                address: errors.address,
              }}
            />

            <PaymentSection
              value={form.payment.method}
              onChange={(method) => setForm({ ...form, payment: { method } })}
            />

            <CommentSection
              value={form.comment}
              onChange={(comment) => setForm({ ...form, comment })}
            />
          </div>

          <div className="lg:w-96">
            <OrderSummary
              items={cartItems.map((item) => ({
                id: item.id,
                name: item.product.name,
                price: item.priceAtAdding,
                quantity: item.quantity,
              }))}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </MyContainer>
    </div>
  );
}
