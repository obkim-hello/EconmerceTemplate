// import logo from "./logo.svg";
import "./App.css";
import React from "react";
import "./App.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import { Provider } from "react-redux";
import PubRoutes from "./routes/pubRoutes";
import { persistor, globalStore } from "./store/globalStore";
// import  from "./store/globalStore";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Provider store={globalStore}>
      <PersistGate persistor={persistor}>
        <PubRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;
