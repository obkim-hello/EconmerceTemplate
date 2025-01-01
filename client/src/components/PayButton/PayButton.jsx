import { useSelector } from "react-redux";
import stripe_api from "../../service/stripe_api";
import { get_user } from "../../service/decrypt";
import { globalStore } from "../../store/globalStore";

export default function PayButton({ cartItems }) {
  const user = useSelector((state) => state.session.user);
  const handleCheckout = () => {
    // axios
    //   .post(`${url}/stripe/create-checkout-session`, {
    //     cartItems,
    //     userId: user._id,
    //   })
    //   .then((response) => {
    //     if (response.data.url) {
    //       window.location.href = response.data.url;
    //     }
    //   })
    //   .catch((err) => console.log(err.message));

    stripe_api
      .create_checkout_session(
        cartItems,
        get_user(globalStore.getState().session.user)._id
      )
      .then((response) => {
        if (response.url) {
          window.location.href = response.url;
        }
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <button
      className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
      onClick={() => handleCheckout()}
    >
      Check out
    </button>
  );
}
