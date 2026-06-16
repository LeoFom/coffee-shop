import {RootState} from "@/store/store";

const getCartItemsCount =
  (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)

const getCartItems =
  (state: RootState) =>
    state.cart.items


export const cartSelectors = {
  getCartItems,
  getCartItemsCount,
}
