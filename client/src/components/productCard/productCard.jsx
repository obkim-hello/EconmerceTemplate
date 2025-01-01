import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addItem } from "../../store/cartSlice";

export default function ProductCard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [index] = useState(props.index);
  const [product] = useState(props.product);
  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    // navigate("/cart");
  };

  return (
    <div key={index} className="bg-white shadow-md rounded-md overflow-hidden">
      <img
        src={product.image}
        alt="Product"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="font-semibold text-gray-800">{product.name}</h4>
        <p className="text-gray-600 mt-2">${product.price}</p>
        <button
          className="mt-4 w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          onClick={() => {
            handleAddToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            });
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
