import OrderSummary from "@/components/checkout/OrderSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import MyContainer from '@/components/ui/MyContainer';

export default function CheckoutPage() {
  return (
    <main className="w-full bg-brand-bg min-h-screen pt-20 pb-20">
      <MyContainer>
        <div className="mb-10">
          <h1 className="font-serif text-5xl font-bold text-brand-brown">
            Checkout
          </h1>

          <p className="text-brand-muted mt-2">
            Complete your order securely
          </p>
        </div>

        <div className="w-full  grid lg:grid-cols-[1fr_420px] gap-10">
          <CheckoutForm />
          <OrderSummary />
        </div>
      </MyContainer>
    </main>
  );
}