import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, getTotals } from "../../store/cartSlice";
import { Link } from "react-router-dom";
import { sessionService } from "redux-react-session";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { totalQuantity } = useSelector((state) => state.cart);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">ShopEasy</h1>
        <button
          className="text-gray-800 md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <ul
          className={`flex-col md:flex-row md:flex space-x-6 absolute md:static bg-white md:bg-transparent w-full md:w-auto top-full left-0 md:top-auto md:left-auto transform md:transform-none transition-transform ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <li>
            <a
              href="/"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Shop
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="hidden md:block ">
          <div className="flex items-center gap-3 ">
            <Link to="/cart" className="">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                {/* {totalQuantity} */}
                {totalQuantity > 0 ? (
                  <span>Cart ({totalQuantity})</span>
                ) : (
                  <span>Cart</span>
                )}
              </button>
            </Link>
            <Link to="/profile">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
            </Link>
            {/* temp logout button */}
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              onClick={() => {
                sessionService.deleteSession();
                sessionService.deleteUser();
              }}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
