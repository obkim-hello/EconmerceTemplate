import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { connect } from "react-redux";
import Home from "../pages/home/home";
import Cart from "../pages/cart/cart";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import CheckoutSuccess from "../pages/checkout/checkoutSuccess";
import AdminPage from "../pages/AdminPages/AdminPage/AdminPage";
import ManageSingleProduct from "../pages/AdminPages/ManageSingleProduct/ManageSingleProduct";
import NotFound from "../pages/404/404";
import Profile from "../pages/profile/profile";
import Forgetpassword from "../pages/forgetpassword/forgetpassword";
import Resetpassword from "../pages/Resetpassword/Resetpassword";
const pubRoutes = ({ authenticated, checked, user }) => {
  // const nav = useNavigate();
  return (
    <Router basename={process.env.PORT}>
      {checked && (
        <Routes>
          <Route path="/" caseSensitive={false} element={<Home />} />
          <Route path="/home" caseSensitive={false} element={<Home />} />
          <Route path="/cart" caseSensitive={false} element={<Cart></Cart>} />
          <Route
            path="/login"
            caseSensitive={false}
            element={<Login></Login>}
          />
          <Route
            path="/register"
            caseSensitive={false}
            element={<Register></Register>}
          />
          {/* Forgetpassword */}
          <Route
            path="/forgetpassword"
            caseSensitive={false}
            element={<Forgetpassword></Forgetpassword>}
          />

          {/* resetpassword */}
          <Route
            path="/resetpassword/:resetToken"
            caseSensitive={false}
            element={<Resetpassword></Resetpassword>}
          />

          <Route
            path="/checkout-success"
            caseSensitive={false}
            element={
              <PrivateRoute authenticated={authenticated}>
                <CheckoutSuccess></CheckoutSuccess>
              </PrivateRoute>
            }
          />
          {/* profile */}
          <Route
            path="/profile"
            caseSensitive={false}
            element={
              <PrivateRoute authenticated={authenticated}>
                <Profile></Profile>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            caseSensitive={false}
            element={
              <PrivateRoute authenticated={authenticated}>
                <AdminPage></AdminPage>
              </PrivateRoute>
            }
          />
          {/* /admin/products/${product._id} */}
          <Route
            path="/admin/products/:id"
            caseSensitive={false}
            element={
              <PrivateRoute authenticated={authenticated}>
                <ManageSingleProduct></ManageSingleProduct>
              </PrivateRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<NotFound></NotFound>} />
          {/* <Route
            path="/vipDetail/:id"
            caseSensitive={false}
            element={
              <PrivateRoute authenticated={authenticated}>
                <ManageSingleVip></ManageSingleVip>
              </PrivateRoute>
            }
          /> */}
          {/* <Route path="*" element={<NotFound></NotFound>} /> */}
        </Routes>
      )}
    </Router>
  );
};

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated,
  user: session.user,
});
export default connect(mapState)(pubRoutes);
