import {ProductsType} from "@/types/products.types";

export const COFFEE_TYPES = [
  "Beans",
  "Ground",
  "Drip",
  "Capsules",
] as const;

export const ROAST_TYPES = [
  "Light",
  "Medium",
  "Dark",
] as const;

export const PROCESSING_METHODS = [
  "Washed",
  "Natural",
  "Honey",
  "Anaerobic",
  "SemiWashed",
] as const;

export const BREWING_METHODS = [
  "Espresso",
  "Filter",
  "V60",
  "Aeropress",
  "Chemex",
  "Moka",
  "Turkish",
  "FrenchPress",
] as const;

export const WEIGHTS = [
  100,
  200,
  250,
  500,
  1000,
] as const;

export const FLAVOR_NOTES = [
  "Chocolate",
  "Milk Chocolate",
  "Dark Chocolate",

  "Caramel",
  "Toffee",
  "Honey",
  "Vanilla",

  "Orange",
  "Lemon",
  "Grapefruit",
  "Lime",

  "Apple",
  "Pear",
  "Peach",
  "Apricot",

  "Cherry",
  "Strawberry",
  "Raspberry",
  "Blueberry",
  "Blackberry",

  "Tropical Fruits",
  "Pineapple",
  "Mango",
  "Papaya",

  "Nuts",
  "Almond",
  "Hazelnut",
  "Walnut",

  "Tea",
  "Bergamot",
  "Floral",
  "Jasmine",
] as const;

export const ORIGIN_COUNTRIES = [
  "Rwanda",
  "Guatemala",
  "Ethiopia",
  "Honduras",
  "Burundi",
  "El Salvador",
] as const;

export const ROAST_CATEGORIES = [
  {
    value: "espresso",
    label: "Обсмажена під еспресо",
  },
  {
    value: "filter",
    label: "Обсмажена під фільтр",
  },
] as const;

export const PRODUCTS_PREVIEW = [
  {
    name: "КАВА РУАНДА КАБАРЕ 1 КГ",
    image:
      "https://fabrykakavy.com/wp-content/uploads/2026/03/rwanda_kabare_1kg-600x600.webp",
  },
  {
    name: "КАВА ГВАТЕМАЛА ОРІЄНТЕ 1 КГ",
    image:
      "https://fabrykakavy.com/wp-content/uploads/2026/03/oriente_espresso_1kg-600x600.webp",
  },
  {
    name: "КАВА ГОНДУРАС ЛА ПАЗ 1 КГ",
    image:
      "https://fabrykakavy.com/wp-content/uploads/2025/05/la_paz-600x600.webp",
  },
  {
    name: "КАВА ЕФІОПІЯ ГУДЖИ 1 КГ",
    image:
      "https://fabrykakavy.com/wp-content/uploads/2024/01/guji_1kg-600x600.webp",
  },
] as const;

export const EMPTY_PRODUCT: ProductsType = {
  id: "",

  name: "",
  slug: "",

  description: "",
  imageUrl: "",

  category: 'Coffee',

  price: 0,
  discount: 0,

  coffeeDetails: {
    coffeeType: 'Beans',

    roast: 'Dark',

    originCountry: "",
    region: "",

    farm: "",
    processingStation: "",

    variety: "",

    processingMethod: 'Anaerobic',

    altitudeMin: undefined,
    altitudeMax: undefined,

    scaScore: undefined,

    arabicaPercent: undefined,
    robustaPercent: undefined,

    acidity: undefined,
    sweetness: undefined,
    bitterness: undefined,
    body: undefined,

    caffeineLevel: undefined,

    weightGrams: undefined,
  },
};