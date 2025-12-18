import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import ForgotPassword from "./pages/user/ForgotPassword";
import VerifyOtp from "./pages/user/VerifyOtp";
import ResetPassword from "./pages/user/ResetPassword";
import LandingPage from "./pages/home/LandingPage";
import Product from "./pages/product/Product";
import SingleProduct from "./pages/single-product/SingleProduct";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import MyOrder from "./pages/myOrder/MyOrder";
import MyOrderDetail from "./pages/my-order-details/MyOrderDetail";

import Category from "./pages/admin/categories/Category";
import User from "./pages/admin/users/User";
import AdminStats from "./pages/admin/stats/AdminStats";
import AdminProduct from "./pages/admin/product/AdminProdcut";

import SingleProductAdmin from "./pages/admin/product/SingleProductAdmin";
import AdminOrder from "./pages/admin/orders/AdminOrder";
import AdminOrderDetail from "./pages/admin/order-details/AdminOrderDetails";
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  auth: {
    token:
      localStorage.getItem("adminToken") || localStorage.getItem("token") || "",
  },
});
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/my-cart" element={<Cart />} />
          <Route path="/my-checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route path="/my-orders/:id" element={<MyOrderDetail />} />
          <Route path="/admin" element={<AdminStats />} />
          <Route path="/admin/categories" element={<Category />} />
          <Route path="/admin/users" element={<User />} />
          <Route path="/admin/products" element={<AdminProduct />} />
          <Route path="/admin/product/:id" element={<SingleProductAdmin />} />
          <Route path="/admin/orders" element={<AdminOrder />} />
          <Route path="/admin/order/:id" element={<AdminOrderDetail />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
