import {DashboardProductsType, DashboardTab} from "@/dashboard/types/dashboardTypes";

export const DASHBOARD_TABS: DashboardTab[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "products",
    label: "Products",
  },
  {
    id: "orders",
    label: "Orders",
  },
  {
    id: "customers",
    label: "Customers",
  },
  {
    id: "analytics",
    label: "Analytics",
  },
  {
    id: "activity",
    label: "Activity",
  },
  {
    id: "newsletter",
    label: "Newsletter",
  },
  {
    id: "settings",
    label: "Settings",
  },
];

export const EMPTY_PRODUCT: DashboardProductsType = {
  id: "",

  name: "",
  slug: "",
  description: "",
  imageUrl: "",

  category: "",
  brandId: "",

  price: 0,
  discount: 0,

  roast: "",
  coffeeType: "",

  originCountry: "",
  region: "",

  farm: "",
  processingStation: "",

  altitudeMin: 0,
  altitudeMax: 0,

  variety: "",

  processingMethod: "",

  scaScore: 0,

  arabicaPercent: 100,
  robustaPercent: 0,

  acidity: 0,
  sweetness: 0,
  bitterness: 0,
  body: 0,

  caffeineLevel: 0,

  weightGrams: 1000,

  flavorNotes: [],
  brewingMethods: [],
};