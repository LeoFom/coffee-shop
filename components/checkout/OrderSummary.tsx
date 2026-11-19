interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  items: CartItem[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function OrderSummary({ items, onSubmit, isSubmitting }: Props) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="border border-brand-brown/10 rounded-2xl bg-white p-6 md:p-8 sticky top-32">
      <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">Ваше замовлення</h2>

      <div className="flex flex-col gap-4 mb-6 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-brand-text">
              {item.name} <span className="text-brand-muted">× {item.quantity}</span>
            </span>
            <span className="font-medium text-brand-brown">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-brown/10 pt-4 flex justify-between items-center mb-6">
        <span className="font-serif font-bold text-brand-brown">Разом</span>
        <span className="text-2xl font-bold text-brand-brown">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || items.length === 0}
        className="w-full bg-brand-brown text-white rounded-xl py-3.5 font-medium hover:bg-brand-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Оформлення...' : 'Підтвердити замовлення'}
      </button>
    </div>
  );
}