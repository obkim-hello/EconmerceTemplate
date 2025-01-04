import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import {
  TextField,
  Select,
  MenuItem,
  Pagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";

import product_api from "../../../service/product_api";
import CreateProductForm from "./CreateProductForm";
import CreateCategory from "./CreateCategory";
import { apiURL } from "../../../service/api";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
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
      setTotalPages(response.pages);
      setTotalProducts(response.total);
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
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              apiURL +
                              "/productExpress/getfile?key=" +
                              product.images[0]
                            }
                            alt="Product"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-gray-800 font-semibold">
                              {product.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        {/* SKU */}
                        <div>
                          <p className="text-gray-800 font-semibold">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{"$" + product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center gap-4">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/products/${product._id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <div className=" flex justify-between items-center px-4 pt-3 ">
          {/* number / total */}
          <div className="flex justify-start items-center gap-3">
            <select
              data-testid="display-dropdown-amount"
              className="text-dsblue-100 text-sm rounded-xl"
              onChange={(e) => {
                // setTablePageSize(parseInt(e.target.value));
                // setTablePageIndex(1);
                // setIsLoadingTable(true);
                setLimit(e.target.value);
              }}
              value={limit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <p className="text-dsblue-100 text-lg">
              {(page - 1) * limit + 1}-{(page - 1) * limit + products.length} of{" "}
              {totalProducts}
            </p>
          </div>
          <Pagination
            variant="outlined"
            siblingCount={0}
            count={Math.ceil(totalProducts / limit)}
            onChange={handlePageChange}
            rowsPerPage={limit}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
