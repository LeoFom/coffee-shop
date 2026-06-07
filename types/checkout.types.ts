import {ProductsType} from "@/types/products.types";

export type CartItem = {
  product: ProductsType;
  quantity: number;
};

export type CheckoutForm = {
  email: string;

  firstName: string;
  lastName: string;

  phone: string;

  country: string;
  city: string;
  address: string;
  postalCode: string;

  deliveryMethod: "standard" | "express";

  paymentMethod: "card" | "paypal";

  notes?: string;
};