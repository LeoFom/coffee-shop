import { CheckoutFormState, PaymentMethod } from '@/types/checkout.types';

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'cash_on_delivery', label: 'Оплата при отриманні', description: 'Готівкою або карткою кур\'єру/у відділенні' },
  { value: 'online', label: 'Онлайн оплата', description: 'Картою через безпечний платіжний сервіс' },
  { value: 'card', label: 'На реквізити', description: 'Переказ на картку, підтвердження вручну' },
];

export default function PaymentSection({ value, onChange }: Props) {
  return (
    <section className="border border-brand-brown/10 rounded-2xl bg-white p-6 md:p-8">
      <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">Оплата</h2>

      <div className="flex flex-col gap-3">
        {PAYMENT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
              value === option.value
                ? 'border-brand-brown bg-brand-bg'
                : 'border-brand-brown/15 hover:bg-brand-bg/50'
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 accent-brand-brown"
            />
            <div>
              <div className="text-sm font-medium text-brand-brown">{option.label}</div>
              <div className="text-xs text-brand-muted mt-0.5">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}