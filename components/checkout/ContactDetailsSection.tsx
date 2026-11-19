import { CheckoutFormState } from '@/types/checkout.types';

interface Props {
  data: CheckoutFormState['contact'];
  onChange: (data: CheckoutFormState['contact']) => void;
  errors?: Partial<Record<keyof CheckoutFormState['contact'], string>>;
}

export default function ContactDetailsSection({ data, onChange, errors }: Props) {
  const update = (field: keyof CheckoutFormState['contact'], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <section className="border border-brand-brown/10 rounded-2xl bg-white p-6 md:p-8">
      <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">Контактні дані</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-brand-muted mb-1.5">Ім&apos;я *</label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown/40 transition-colors"
          />
          {errors?.firstName && <p className="text-xs text-error mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-xs text-brand-muted mb-1.5">Прізвище *</label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown/40 transition-colors"
          />
          {errors?.lastName && <p className="text-xs text-error mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-xs text-brand-muted mb-1.5">Телефон *</label>
          <input
            type="tel"
            placeholder="+380 XX XXX XX XX"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown/40 transition-colors"
          />
          {errors?.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs text-brand-muted mb-1.5">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown/40 transition-colors"
          />
          {errors?.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
        </div>
      </div>
    </section>
  );
}