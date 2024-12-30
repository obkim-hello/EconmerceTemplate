// import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { sessionReducer, sessionService } from "redux-react-session";

// import rootReducer from "./reducers";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

let mainReducer = function (state = {}, action) {
  switch (action.type) {
    case "SET_IS_lOGIN_FALSE":
      //console.log("CALLED SET_IS_lOGIN_FALSE");
      state.isLogin = false;
      return { ...state, isLogin: false };
    case "SET_IS_lOGIN_TRUE":
      //console.log("CALLED SET_IS_lOGIN_TRUE");
      return { ...state, isLogin: true };
    default:
      return state;
  }
};

let defaultState = {
  main: {
    isLogin: false,
    loginType: "",
  },
};
const globalStore = configureStore(
  {
    reducer: {
      // persistedReducer,
      main: mainReducer,
      session: sessionReducer,
      // orderHistory: orderHistoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  },
  defaultState,

  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const validateSession = (session) => {
  // check if your session is still valid
  return true;
};

const options = {
  refreshOnCheckAuth: true,
  redirectPath: "/",
  driver: "COOKIES",
  validateSession,
};

sessionService.initSessionService(globalStore, options);
export default globalStore;
