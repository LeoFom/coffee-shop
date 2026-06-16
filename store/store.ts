import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';
import productReducer from './products/productSlice';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;