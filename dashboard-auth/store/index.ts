import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import instagramReducer from './slices/instagramSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    instagram: instagramReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;