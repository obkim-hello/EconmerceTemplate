import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import product_api from "../../../service/product_api";
import CreateProductForm from "./CreateProductForm";
import CreateCategory from "./CreateCategory";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    images: [],
    active: true,
    tags: "",
    category: "",
    specifications: {},
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await product_api.fetchProducts({
        page,
        limit,
        search,
        category,
      });
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const response = await product_api.createProduct(newProduct);
      console.log("Product created:", response);
      fetchAllProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        images: [],
        active: true,
        tags: "",
        category: "",
        specifications: {},
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleImageUpload = async (productId, files) => {
    try {
      const response = await product_api.uploadProductImage(productId, files);
      console.log("Images uploaded:", response);
      fetchAllProducts();
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleDeleteImage = async (key) => {
    try {
      const response = await product_api.deleteFileFromS3(key);
      console.log("Image deleted:", response);
      fetchAllProducts();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await product_api.deleteProductById(productId);
      console.log("Product deleted:", response);
      fetchAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [page, limit, search, category]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>

      <div className="flex flex-wrap gap-4">
        <CreateProductForm />

        <CreateCategory />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Product List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Stock</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">
                    {product.price}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.stock}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {/* delete product */}
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 mr-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
