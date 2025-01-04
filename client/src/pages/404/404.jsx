import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-red-500">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mt-4">
        Page Not Found
      </p>
      <p className="text-lg text-gray-600 mt-2">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={handleGoHome}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
