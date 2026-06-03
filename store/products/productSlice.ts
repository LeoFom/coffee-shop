import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {DashboardProductsType} from "@/types/products";
import {MOCK_PRODUCTS_DASHBOARD} from "@/lib/data/mockProducts";

interface ProductsState {
  items: DashboardProductsType[];
}

const initialState: ProductsState = {
  items: MOCK_PRODUCTS_DASHBOARD,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<DashboardProductsType[]>) => {
      state.items = action.payload;
    },

    addProduct: (state, action: PayloadAction<DashboardProductsType>) => {
      state.items.push(action.payload);
    },

    updateProduct: (state, action: PayloadAction<DashboardProductsType>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
} = productsSlice.actions;

export default productsSlice.reducer;