// import jwtDecode from "jwt-decode";
const jwtDecode = require("jwt-decode");

function get_user(token) {
  if (token) {
    const user = jwtDecode.jwtDecode(token);
    return user;
  }
  return null;
}

export { get_user };
