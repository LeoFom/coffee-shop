import {CartItem} from "@/types/checkout.types";

export const mockCartItems: CartItem[] = [
  {
    id: '0',
    quantity: 2,
    product: {
      id: "1",
      name: "Colombia Supremo",
      slug: "colombia-supremo",
      description: "",
      imageUrl:
        "https://fabrykakavy.com/wp-content/uploads/2026/03/rwanda_kabare_1kg-600x600.webp",
      category: "Coffee",
      price: 14.99,
      discount: 10,
      coffeeDetails: {
        roast: "Medium",
        coffeeType: "Beans",
        originCountry: "Colombia",
        weightGrams: 250,
      },
    },
    priceAtAdding: 13.49,
  },
  {
    id: '1',
    quantity: 1,
    product: {
      id: "2",
      name: "V60 Dripper",
      slug: "v60-dripper",
      description: "",
      imageUrl:
        "https://fabrykakavy.com/wp-content/uploads/2026/03/rwanda_kabare_1kg-600x600.webp",
      category: "Equipment",
      price: 24.99,
      discount: 0,
    },
    priceAtAdding: 24.99,
  },
];