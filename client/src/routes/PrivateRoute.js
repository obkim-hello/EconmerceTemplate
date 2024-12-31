import React from "react";
import { Navigate } from "react-router-dom";
import SessionTimeout from "./SessionTimeout";
//location.pathname to get next link

// const param = new URLSearchParams(window.location.pathname).get("next");

const PrivateRoute = ({ children, authenticated, path }) => {
  return authenticated ? (
    <div>
      {children}
      <SessionTimeout />
    </div>
  ) : (
    // <div></div>
    // http://localhost:3000/login/?next=qwe
    <Navigate to={"/login/?next=" + window.location.pathname} />
  );
};

export default PrivateRoute;
