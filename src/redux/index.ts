import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "@/features/likesSlice";
import cartReducer from "@/features/cartSlice";
import currencyReducer from "@/features/currencySlice";
import languageReducer from "@/features/languageSlice";
import bannerReducer from '@/features/bannerSlice'
import productReducer from '@/features/productSlice'
import categoryReducer from "@/features/categorySlice";

export const store = configureStore({
  reducer: {
    likes: likesReducer,
    cart: cartReducer,
    currency: currencyReducer,
    language: languageReducer,
    banner: bannerReducer,
    products: productReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;