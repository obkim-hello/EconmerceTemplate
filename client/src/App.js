// import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import { Provider } from "react-redux";
import PubRoutes from "./routes/pubRoutes";
import globalStore from "./store/globalStore";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Provider store={globalStore}>
      <PubRoutes />
    </Provider>
  );
}

export default App;

{
  /* <GoogleOAuthProvider clientId="163584497548-6uovpebrvioqdepje90dinuagvi60ulc.apps.googleusercontent.com">
          <div className="App">
            <GoogleLogin setUser={setUser}></GoogleLogin>
            {user && user.name}
            {user && user.email}
          </div>
        </GoogleOAuthProvider> */
}
