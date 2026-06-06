import {RootState} from "@/store/store";

export const selectProducts = (state: RootState) => state?.products.items;

// export const selectProductBySlug = (slug: string) => (state: RootState) =>
//   state?.products.items.find((p: Product) => p.slug === slug);