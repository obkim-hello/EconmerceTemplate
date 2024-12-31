// import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { sessionReducer, sessionService } from "redux-react-session";
import cartReducer from "./cartSlice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

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
const store = configureStore(
  {
    reducer: {
      main: mainReducer,
      session: sessionReducer,
      cart: persistedCartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
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

// globalStore.dispatch(getTotals());

sessionService.initSessionService(store, options);
export const globalStore = store;

export const persistor = persistStore(store);
