import Footer from "./components/Footer"
import Header from "./components/Header"
import HomeScreen from "./screens/HomeScreen"
import { Routes, Route } from 'react-router-dom'
import ProductScreen from "./screens/ProductScreen"
import CartScreen from "./screens/CartScreen"
import LoginScreen from "./screens/LoginScreen"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RegisterScreen from "./screens/RegisterScreen"
import ShippingScreen from "./screens/ShippingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import PlaceOrderScreen from "./screens/PlaceOrderScreen"
import OrderScreen from "./screens/OrderScreen"
import ProfileScreen from "./screens/ProfileScreen"
import { useSelector } from "react-redux"
import AdminNavigator from "./AdminNavigator"

function App() {

  const { userInfo } = useSelector(state => state.auth)

  if (userInfo && userInfo.isAdmin) return <AdminNavigator />

  return (
    <>
      <Header />
      <Routes>
      <Route path="/" element={<HomeScreen />} />
        <Route path="/page/:pageNo" element={<HomeScreen />} />
        <Route path="/search/:keyword" element={<HomeScreen />} />
        <Route path="/search/:keyword/page/:pageNo" element={<HomeScreen />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/orders/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
