import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
import { connect } from "react-redux";
import Home from "../pages/home/home";
import Cart from "../pages/cart/cart";
import Login from "../pages/login/login";
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
