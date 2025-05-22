import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import orderSlice from "./orderSlice";
import categorySlice from "./adminCategorySlice";
import adminUserSlice from "./adminUserSlice";
import adminProductSlice from "./adminProductSlice";
import adminOrderSlice from "./adminOrderSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
    category: categorySlice,
    adminUser: adminUserSlice,
    adminProduct: adminProductSlice,
    order: adminOrderSlice,
  },
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
