import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import OrderListScreen from "./adminScreen/OrderListScreen";
import OrderScreen from "./screens/OrderScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./adminScreen/ProductListScreen";
import ProductEditScreen from "./adminScreen/ProductEditScreen";
import UserListScreen from "./adminScreen/UserListScreen";
import UserEditScreen from "./adminScreen/UserEditScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from './screens/CartScreen'
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";

const AdminNavigator = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/page/:pageNo" element={<HomeScreen />} />
        <Route path="/search/:keyword" element={<HomeScreen />} />
        <Route path="/search/:keyword/page/:pageNo" element={<HomeScreen />} />
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/orders/:id" element={<OrderScreen />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default AdminNavigator;
