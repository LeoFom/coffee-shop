import {ProductsType} from "@/types/products.types";

export type CartItem = {
  id: string;
  product: ProductsType;
  quantity: number;
  priceAtAdding: number;
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

export interface NPCity {
  ref: string;
  cityRef: string;
  name?: string;
  shortName?: string;
  area?: string;
}

export interface NPCityData {
  AddressDeliveryAllowed: boolean;
  Area: string;
  DeliveryCity: string;
  MainDescription: string;
  ParentRegionCode: string;
  ParentRegionTypes: string;
  Present: string;
  Ref: string;
  Region: string;
  RegionTypes: string;
  RegionTypesCode: string;
  SettlementTypeCode: string;
  StreetsAvailability: boolean;
  Warehouses: number;
}

export interface NPWarehouse {
  ref: string;
  number: string;
  name: string;
  shortAddress?: string;
  categoryOfWarehouse?: string;
}

export type DeliveryMethod = 'np_warehouse' | 'np_postomat' | 'courier';
export type PaymentMethod = 'cash_on_delivery' | 'online' | 'card';

export interface CheckoutFormState {
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  delivery: {
    method: DeliveryMethod;
    city: NPCity | null;
    warehouse: NPWarehouse | null;
    address: string; // для кур'єра
  };
  payment: {
    method: PaymentMethod;
  };
  comment: string;
}

export const initialCheckoutState: CheckoutFormState = {
  contact: { firstName: '', lastName: '', phone: '', email: '' },
  delivery: { method: 'np_warehouse', city: null, warehouse: null, address: '' },
  payment: { method: 'cash_on_delivery' },
  comment: '',
};