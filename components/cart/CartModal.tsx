'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import Button from '@/ui/ButtonSecond';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.priceAtAdding * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-brand-brown/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300">

        <div className="flex items-center justify-between p-6 border-b border-brand-brown/10">
          <h2 className="font-serif font-bold text-2xl text-brand-brown">Your Cart</h2>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-brown p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-brand-muted mt-10">Your cart is empty.</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-card-sand rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-brand-brown/40">
                  {item.product.category}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-brand-brown leading-tight mb-1">{item.product.name}</h4>
                  <p className="text-brand-muted text-sm mb-2">${item.priceAtAdding.toFixed(2)}</p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.product.id, amount: -1 }))}
                      className="w-7 h-7 rounded-full border border-brand-brown/20 flex items-center justify-center hover:bg-brand-brown/5 text-brand-brown"
                    >-</button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.product.id, amount: 1 }))}
                      className="w-7 h-7 rounded-full border border-brand-brown/20 flex items-center justify-center hover:bg-brand-brown/5 text-brand-brown"
                    >+</button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full py-1">
                  <p className="font-bold text-brand-brown">${(item.priceAtAdding * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="text-sm text-red-400 hover:text-red-600 underline mt-3"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-brand-brown/10 bg-brand-bg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-brand-muted">Subtotal</span>
              <span className="font-serif font-bold text-2xl text-brand-brown">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full">Make a purchase</Button>
          </div>
        )}
      </div>
    </>
  );
}