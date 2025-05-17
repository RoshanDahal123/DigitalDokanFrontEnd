import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/my-cart" element={<Cart />} />
          <Route path="/my-checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route path="/my-orders/:id" element={<MyOrderDetail />} />
          <Route path="/admin" element={<AdminStats />} />
          <Route path="/admin/categories" element={<Category />} />
          <Route path="/admin/users" element={<User />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
