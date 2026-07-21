'use client';

import Link from 'next/link';
import MyContainer from '@/ui/MyContainer';
import Button from '@/ui/ButtonSecond';
import {useDispatch, useSelector} from 'react-redux';
import CartModal from '@/cart/CartModal';
import {useEffect, useState} from "react";
import {cartSelectors} from "@/store/cart/cartSelectors";
import {getCartItems} from "@/lib/features/api/cart/getCartItems";
import {setCartItems} from "@/store/cart/cartSlice";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();

  const cartItemsCount = useSelector(cartSelectors.getCartItemsCount);

  useEffect(() => {
    const initCart = async () => {
      try {
        const data = await getCartItems();
        // console.log(" ...useEffect - [Header] - Loaded data: ", data);

        if (data?.success) {
          dispatch(setCartItems(data.cartItems));
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    initCart();
  }, [dispatch]);

  return (
    <>
      <header className="w-full py-6 absolute top-0 z-30">
        <MyContainer className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-brown rounded-full"></div>
            <span className="font-serif font-bold text-2xl text-brand-brown tracking-tighter">Coffeo</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="text-brand-brown font-medium hover:text-opacity-70 flex items-center gap-1">
              Products <span className="text-xs">▼</span>
            </Link>
            <Link href="/shop" className="text-brand-brown font-medium hover:text-opacity-70">Shop</Link>
            <Link href="/orders" className="text-brand-brown font-medium hover:text-opacity-70">Orders</Link>
            <Link href="/checkout" className="text-brand-brown font-medium hover:text-opacity-70">Checkout</Link>
            <Link href="/membership" className="text-brand-brown font-medium hover:text-opacity-70">Membership</Link>
            <Link href="/dashboard" className="text-brand-brown font-medium hover:text-opacity-70">Dashboard</Link>
            <Link href="/profile" className="text-brand-brown font-medium hover:text-opacity-70">Profile</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button id={'search'} className="p-2 hover:bg-black/5 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>

            <div
              className="relative w-fit h-fit group"
              onClick={() => setIsCartOpen(true)}
            >
              <div
                className={`absolute ${cartItemsCount > 99 ? "w-[25px] h-[25px]" : "w-[20px] h-[20px]"}  bg-brand-brown
                  rounded-full
                  text-white text-[14px] font-semibold
                  flex justify-center items-center
                  leading-normal
                  ${cartItemsCount > 99 ? "top-[-6px] right-[-6px]" : "top-[-2px] right-[-4px]"}
                  right-[-2px]
                  cursor-pointer
                  
                `}
              >
                <span>
                  {cartItemsCount}
                </span>
              </div>
              <button
                id={'cart'}
                className="p-2 group-hover:bg-black/5 rounded-full"
              ><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></button>
            </div>

            <Button href="/auth/login" variant="primary" className="hidden md:flex">
              Log in / Sign up
            </Button>
          </div>
        </MyContainer>
      </header>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}