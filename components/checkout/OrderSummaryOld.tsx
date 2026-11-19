'use client'
import Image from "next/image";
import {useSelector} from "react-redux";
import {cartSelectors} from "@/store/cart/cartSelectors";

export default function OrderSummary() {
  const cartItems = useSelector(cartSelectors.getCartItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + Number(item?.product?.price ?? 0) * item.quantity, 0);

  return (
    <aside className="h-fit sticky top-28">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="font-semibold text-2xl text-brand-brown mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-bg">
                <Image
                  fill
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-brand-brown">
                  {item.product.name}
                </h3>

                <p className="text-sm text-brand-muted">
                  Qty: {item.quantity}
                </p>

                <p className="text-sm text-brand-muted">
                  {item.product.coffeeDetails?.roast}
                </p>
              </div>

              <div className="font-semibold">
                $
                {(
                  item.product.price *
                  item.quantity
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-5 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$5.00</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-$4.50</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t pt-4">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <button className="w-full mt-6 bg-brand-brown text-white rounded-2xl py-4 font-semibold hover:opacity-90 transition">
          Place Order
        </button>

        <div className="mt-4 text-center text-sm text-brand-muted">
          🔒 Secure checkout
        </div>
      </div>
    </aside>
  );
}