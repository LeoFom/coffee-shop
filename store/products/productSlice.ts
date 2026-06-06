import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ProductsType} from "@/types/products.types";

interface ProductsState {
  items: ProductsType[];
}

const initialState: ProductsState = {
  items: [],
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductsType[]>) => {
      state.items = action.payload;
    },

    addProduct: (state, action: PayloadAction<ProductsType>) => {
      state.items.push(action.payload);
    },

    updateProduct: (state, action: PayloadAction<ProductsType>) => {
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