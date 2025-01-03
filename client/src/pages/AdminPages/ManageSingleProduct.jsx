import React, { useEffect, useState } from "react";
import { get_user } from "../../service/decrypt";
import { globalStore } from "../../store/globalStore";
import { useNavigate, useParams } from "react-router-dom";
import Dropzone from "react-dropzone";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import productApi from "../../service/product_api";
import { apiURL } from "../../service/api";

export default function ManageSingleProduct() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const user = get_user(globalStore.getState().session.user);
    if (!user || !user.admin) {
      navigate("/home");
    } else {
      fetchProduct();
      fetchCategories();
    }
  }, []);
  const fetchProduct = async () => {
    try {
      productApi
        .getProductById(id)
        .then((res) => {
          setProduct(res.product);
          //   setFiles(res.product.images);
          // convert image urls to files
          const files = res.product.images.map((img) => {
            return img;
          });
          setFiles(files);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productApi.getAllCategories();
      setCategories(res.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const onDrop = (acceptedFiles) => {
    acceptedFiles.map((file) => {
      setFiles((prev) => [...prev, file]);
    });
  };
  const handleChange = (e) => {
    e.preventDefault();
    e.target.files.map((file) => {
      setFiles((prev) => [...prev, file]);
    });
  };
  const handleUploadImages = async (product_id) => {
    let totalSize = 0;
    files.map((file) => {
      totalSize += file.size;
    });

    if (files.length !== 0) {
      //console.log(files);
      const formData = new FormData();
      for (var x = 0; x < files.length; x++) {
        formData.append("file", files[x]);
      }
      await productApi
        .uploadProductImage(product_id, formData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Please upload an image");
    }
  };
  const handleDelete = (e, index) => {
    e.preventDefault();
    files.splice(index, 1);
    setFiles([...files]);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setProduct({ ...product, categories: [e.target.value] });
  };

  const handleCheckboxChange = (e) => {
    setProduct({ ...product, active: e.target.checked });
  };

  const handleSubmit = async () => {
    try {
      await productApi
        .updateProductById(id, product)
        .then((res) => {
          console.log(res);
          alert("Product updated successfully");
        })
        .catch((err) => {
          console.error("Error updating product:", err);
          alert("Failed to update product");
        });
      console.log(product);

      const imgObject = {
        keys: [],
        images: [],
      };
      files.map((file) => {
        if (file instanceof File) {
          imgObject.images.push(file);
        } else {
          imgObject.keys.push(file);
        }
      });
      console.log(imgObject);
      await productApi
        .updateProductImages(id, imgObject)
        .then((res) => {
          console.log(res);
          alert("Product images updated successfully");
        })
        .catch((err) => {
          console.error("Error updating product images:", err);
          alert("Failed to update product images");
        });
      await fetchProduct();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Manage Product</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <TextField
            label="Name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </div>
        <div className="col-span-1">
          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
            <TextField
              label="Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 ">
            <TextField
              label="SKU"
              name="sku"
              value={product.sku}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={product.categories[0]}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>{" "}
        <div>
          <h3>Specifications</h3>
          {product.specifications.map((spec, specIndex) => (
            <div key={specIndex} className="mb-4 border p-4 rounded-lg">
              <TextField
                label="Specification Name. i.e. Size, Color"
                value={spec.specName}
                onChange={(e) => {
                  const updatedSpecs = [...product.specifications];
                  updatedSpecs[specIndex].specName = e.target.value;
                  setProduct({
                    ...product,
                    specifications: updatedSpecs,
                  });
                }}
                fullWidth
              />
              {spec.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="grid grid-cols-2 gap-4 mt-2 border p-4 rounded-lg my-4"
                >
                  <TextField
                    label="Option Value."
                    placeholder="i.e. Small, Red"
                    value={option.value}
                    onChange={(e) => {
                      const updatedSpecs = [...product.specifications];
                      updatedSpecs[specIndex].options[optionIndex].value =
                        e.target.value;
                      setProduct({
                        ...product,
                        specifications: updatedSpecs,
                      });
                    }}
                    fullWidth
                  />
                  <TextField
                    label="Price Adjustment"
                    placeholder="ie. price + 10"
                    type="number"
                    value={option.price}
                    onChange={(e) => {
                      const updatedSpecs = [...product.specifications];
                      updatedSpecs[specIndex].options[optionIndex].price =
                        e.target.value;
                      setProduct({
                        ...product,
                        specifications: updatedSpecs,
                      });
                    }}
                    fullWidth
                  />
                  <TextField
                    label="Stock"
                    type="number"
                    value={option.stock}
                    onChange={(e) => {
                      const updatedSpecs = [...product.specifications];
                      updatedSpecs[specIndex].options[optionIndex].stock =
                        e.target.value;
                      setProduct({
                        ...product,
                        specifications: updatedSpecs,
                      });
                    }}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      const updatedSpecs = [...product.specifications];
                      if (updatedSpecs[specIndex].options.length === 1) {
                        updatedSpecs.splice(specIndex, 1);
                      } else {
                        updatedSpecs[specIndex].options.splice(optionIndex, 1);
                      }
                      setProduct({
                        ...product,
                        specifications: updatedSpecs,
                      });
                    }}
                  >
                    Remove Option
                  </Button>
                </div>
              ))}
              <div className="flex justify-between items-center gap-3">
                <Button
                  variant="contained"
                  onClick={() => {
                    const updatedSpecs = [...product.specifications];
                    updatedSpecs[specIndex].options.push({
                      value: "",
                      price: 0,
                      stock: 0,
                    });
                    setProduct({
                      ...product,
                      specifications: updatedSpecs,
                    });
                  }}
                >
                  Add Option
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    const updatedSpecs = [...product.specifications];
                    updatedSpecs.splice(specIndex, 1);
                    setProduct({
                      ...product,
                      specifications: updatedSpecs,
                    });
                  }}
                >
                  Remove this Specification
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="contained"
            onClick={() => {
              setProduct({
                ...product,
                specifications: [
                  ...product.specifications,
                  {
                    specName: "",
                    options: [{ value: "", price: 0, stock: 0 }],
                  },
                ],
              });
            }}
          >
            Add Specification
          </Button>
        </div>
        <div>
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section data-testid="dropzone" className="w-full">
                <div {...getRootProps()}>
                  <div
                    for="dropzone-file"
                    className="flex flex-col justify-center items-center w-full h-24 bg-violet-10 rounded-lg border-2 border-violet-80 border-dashed hover:bg-violet-20 hover:border-violet-90"
                  >
                    <div className="flex flex-col justify-center items-center pt-5 pb-6 h-full">
                      <svg
                        className="mb-3 w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop your files here
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {/* {t("Total_file_size_10MB_Max_files_25")} */}
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      //   must be img fies
                      accept="image/*"
                      multiple
                      onChange={(e) => handleChange(e)}
                      // className="input-zone"
                      {...getInputProps()}
                    />
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
          {files.length > 0 && (
            <div className="flex flex-wrap my-4 mt-8 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center w-32 h-32 rounded-lg overflow-hidden group"
                >
                  <img
                    src={
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : apiURL + "/productExpress/getfile?key=" + file
                    }
                    alt="preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDelete(e, index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* a delete all button */}
          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              className="text-white bg-red-500 px-2 py-1 rounded"
            >
              Delete All
            </button>
          )}
        </div>
        <div className="col-span-1">
          <FormControlLabel
            control={
              <Checkbox
                checked={product.active}
                onChange={handleCheckboxChange}
              />
            }
            label="Active"
          />
        </div>
        <div className="col-span-1">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update Product
          </Button>
        </div>
      </div>
    </div>
  );
}
