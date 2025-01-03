import React, { useEffect, useState } from "react";
import Products from "../../../components/AdminComponents/Products/Products";
import Orders from "../../../components/AdminComponents/Orders/Orders";
import Customers from "../../../components/AdminComponents/Customers/Customers";
import Navbar from "../../../components/AdminComponents/Navbar/Navbar";
import { globalStore } from "../../../store/globalStore";
import { get_user } from "../../../service/decrypt";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("Products");
  const navigate = useNavigate();

  useEffect(() => {
    const user = get_user(globalStore.getState().session.user);
    // only allow admin to access this page
    if (!user || !user.admin) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <div className="mb-6 flex justify-center">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Products"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("Products")}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              activeTab === "Orders" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("Orders")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Customers"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("Customers")}
          >
            Customers
          </button>
        </div>

        <div className="bg-white p-6 shadow-md rounded-md">
          {activeTab === "Products" && <Products />}
          {activeTab === "Orders" && <Orders />}
          {activeTab === "Customers" && <Customers />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
