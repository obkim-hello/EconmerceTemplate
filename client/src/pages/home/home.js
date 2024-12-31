import React from "react";
import Navbar from "../../components/navbar/Navbar";
import ProductCard from "../../components/productCard/productCard";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header
        className="bg-cover bg-center h-96"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1920x400')",
        }}
      >
        <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-white text-4xl font-bold">Welcome to ShopEasy</h2>
          <p className="text-gray-200 mt-4 text-lg">
            Find your perfect products with exclusive discounts.
          </p>
          <button className="mt-6 bg-white text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </header>

      {/* Products Section */}
      <section className="container mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">
          Featured Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            // <div
            //   key={index}
            //   className="bg-white shadow-md rounded-md overflow-hidden"
            // >
            //   <img
            //     src="https://via.placeholder.com/150"
            //     alt="Product"
            //     className="w-full h-48 object-cover"
            //   />
            //   <div className="p-4">
            //     <h4 className="font-semibold text-gray-800">Product Name</h4>
            //     <p className="text-gray-600 mt-2">$99.99</p>
            //     <button className="mt-4 w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            //       Add to Cart
            //     </button>
            //   </div>
            // </div>
            <ProductCard key={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 flex justify-between">
          <p>&copy; 2024 ShopEasy. All rights reserved.</p>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
