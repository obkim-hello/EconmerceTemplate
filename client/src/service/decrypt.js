// import jwtDecode from "jwt-decode";
const jwtDecode = require("jwt-decode");
// import globalStore from "../store/globalStore";
const globalStore = require("../store/globalStore");

function get_user() {
  // globalStore.getState().session.user
  if (globalStore.globalStore.getState().session.authenticated) {
    const user = jwtDecode.jwtDecode(
      globalStore.globalStore.getState().session.user
    );
    return user;
  }
  return null;
}

function get_token() {
  return globalStore.getState().session.auth_token;
}

export { get_user, get_token };
