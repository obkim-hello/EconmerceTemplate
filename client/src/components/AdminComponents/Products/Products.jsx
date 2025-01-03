import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

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
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const res = await product_api.getAllCategories();
      setCategories(res.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
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

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await product_api.deleteProductById(productId);
      console.log("Product deleted:", response);
      fetchAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, [page, limit, category]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchAllProducts();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [search]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>

      <div className="flex flex-wrap gap-4">
        <CreateProductForm />

        <CreateCategory />
      </div>

      <div>
        <div className="flex justify-start items-center gap-4 my-6">
          <TextField
            label="Search"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            // margin="normal"
          />
          <Select
            value={category}
            onChange={handleCategoryChange}
            displayEmpty
            variant="outlined"
            // margin="normal"
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </div>
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
                    <div className="flex justify-start items-center gap-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/${product._id}`)
                        }
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
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
