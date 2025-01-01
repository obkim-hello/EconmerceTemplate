// import jwtDecode from "jwt-decode";
const jwtDecode = require("jwt-decode");
// import globalStore from "../store/globalStore";
const globalStore = require("../store/globalStore");

function get_user(token) {
  // globalStore.getState().session.user
  console.log("Token -> ", token);
  if (token) {
    const user = jwtDecode.jwtDecode(token);
    return user;
  }
  return null;
}

export { get_user };
