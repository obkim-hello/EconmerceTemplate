import axios from "axios";
import { apiURL } from "./api";
axios.defaults.withCredentials = true;
const cors = require("cors");

cors({
  origin: true,
  credentials: true,
  exposedHeaders: ["set-cookie"],
});

async function create_checkout_session(cartItems, user_id) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/stripe/create-checkout-session/`, {
        cartItems: cartItems,
        userId: user_id,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export default { create_checkout_session };
