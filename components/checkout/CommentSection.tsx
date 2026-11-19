interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CommentSection({ value, onChange }: Props) {
  return (
    <section className="border border-brand-brown/10 rounded-2xl bg-white p-6 md:p-8">
      <h2 className="text-xl font-serif font-bold text-brand-brown mb-4">Коментар до замовлення</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Побажання щодо замовлення чи доставки (необов'язково)"
        className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown/40 transition-colors resize-none"
      />
    </section>
  );
}