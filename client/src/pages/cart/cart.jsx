import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  addItem,
  decrementItem,
  clearCart,
} from "../../store/cartSlice";
import Navbar from "../../components/navbar/Navbar";
import { globalStore } from "../../store/globalStore";
import { useNavigate } from "react-router-dom";
import PayButton from "../../components/PayButton/PayButton";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    dispatch(removeItem({ id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncrementItem = (item) => {
    dispatch(
      addItem({ id: item.id, name: item.name, price: item.price, quantity: 1 })
    );
  };

  const handleDecrementItem = (item) => {
    if (item.quantity === 1) {
      dispatch(removeItem({ id: item.id }));
    } else {
      dispatch(
      decrementItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
      );
    }
  };
  const handleCheckout = () => {
    if (globalStore.getState().session.authenticated) {
      // navigate("/cart/");
      alert("Checkout successful!");
    } else {
      alert("You need to be logged in to proceed to checkout.");
      navigate("/login/?next=/cart");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>

        {cart.cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="border-b pb-2">Product</th>
                    <th className="border-b pb-2">Quantity</th>
                    <th className="border-b pb-2">Price</th>
                    <th className="border-b pb-2">Total</th>
                    <th className="border-b pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-2">
                        {" "}
                        <td className="py-2 flex items-center">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover mr-4"
                            />
                            {item.name}
                          </div>
                        </td>
                      </td>
                      <td className="py-2 ">
                        <div className="flex items-center h-full">
                          <button
                            className="text-gray-800 px-2 py-1 border rounded hover:bg-gray-200"
                            onClick={() => handleDecrementItem(item)}
                          >
                            -
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            className="text-gray-800 px-2 py-1 border rounded hover:bg-gray-200"
                            onClick={() => handleIncrementItem(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2">${item.price.toFixed(2)}</td>
                      <td className="py-2">${item.totalPrice.toFixed(2)}</td>
                      <td className="py-2">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-800 font-semibold text-lg">
                Total: ${cart.totalPrice.toFixed(2)}
              </p>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
            <div className="mt-6">
              {globalStore.getState().session.authenticated ? (
                <PayButton cartItems={cart.cartItems} />
              ) : (
                <button
                  className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                  onClick={() => navigate("/login/?next=/cart")}
                >
                  Login to Checkout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
