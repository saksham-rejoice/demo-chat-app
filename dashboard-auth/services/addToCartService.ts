import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import { store } from "@/store";
import { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } from "@/store/slices/cartSlice";
import { Product } from "@/types/product";

export const addItemToCart = (product: Product) => {
  store.dispatch(addToCart(product));
};

export const removeItemFromCart = (productId: number) => {
  store.dispatch(removeFromCart(productId));
};

export const updateCartItem = (id: number, quantity: number) => {
  store.dispatch(updateQuantity({ id, quantity }));
};

export const viewCartItems = () => {
  return store.getState().cart.items;
};

export const clearCartItems = () => {
  store.dispatch(clearCart());
};