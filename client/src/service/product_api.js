import axios from "axios";
import { apiURL } from "./api";
axios.defaults.withCredentials = true;
const cors = require("cors");

cors({
  origin: true,
  credentials: true,
  exposedHeaders: ["set-cookie"],
});

// async function login(email, password) {
//   return new Promise((resolve, reject) => {
//     axios
//       .post(`${apiURL}/userExpress/login/`, {
//         email: email,
//         password: password,
//       })
//       .then((res) => {
//         resolve(res.data);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// }

async function uploadProductImage(productId, files) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("product_id", productId);
    files.forEach((file) => {
      formData.append("file", file);
    });

    axios
      .post(`${apiURL}/productExpress/uploadProductImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
async function getFileFromS3(key) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/productExpress/getfile`, { params: { key } })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
async function deleteFileFromS3(key) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiURL}/productExpress/deletefile`, { params: { key } })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
async function deleteFolderFromS3(folder) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiURL}/productExpress/deletefolder`, { params: { folder } })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
async function createProduct(productData) {
  console.log("productData", productData);
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/productExpress/createProducts`, productData)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
async function fetchProducts({
  page = 1,
  limit = 10,
  search = "",
  category = "",
}) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/productExpress/products`, {
        params: {
          page,
          limit,
          search,
          category,
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

async function getAllCategories() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/productExpress/categories`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

async function createCategory(categoryData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/productExpress/categories`, categoryData)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
// get product by id
async function getProductById(productId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/productExpress/products/${productId}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

// update product by id
async function updateProductById(productId, productData) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${apiURL}/productExpress/products/${productId}`, productData)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
// delete product by id
async function deleteProductById(productId) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiURL}/productExpress/products/${productId}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

const productApi = {
  uploadProductImage,
  getFileFromS3,
  deleteFileFromS3,
  deleteFolderFromS3,
  createProduct,
  fetchProducts,
  getAllCategories,
  createCategory,
  getProductById,
  updateProductById,
  deleteProductById,
};

export default productApi;
