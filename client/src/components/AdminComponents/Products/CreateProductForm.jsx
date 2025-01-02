import React, { useEffect, useState } from "react";
import productApi from "../../../service/product_api";
import Dropzone from "react-dropzone";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const CreateProductForm = (props) => {
  const [files, setFiles] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    images: "",
    active: true, // Default to true, but you can adjust as needed
    category: "",
    specifications: [],
  });
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // get all categories
    productApi
      .getAllCategories()
      .then((res) => {
        console.log("Categories:", res);
        setCategories(res.categories);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
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
  const handleCreateProduct = async () => {
    try {
      //   await handleUploadImages();
      //   const response = productApi.createProduct(newProduct);
      //   const data = await response.json();
      //   if (response.ok) {
      //     alert("Product created successfully");
      //     setOpen(false); // Close modal on success
      //     // Reset form or redirect as needed
      //   } else {
      //     alert(`Error: ${data.message}`);
      //   }
      await productApi
        .createProduct(newProduct)
        .then((res) => {
          console.log("Product created:", res);
          handleUploadImages(res.product._id);
          alert("Product created successfully");
          setOpen(false);
          setNewProduct({
            name: "",
            description: "",
            price: "",
            stock: "",
            sku: "",
            images: "",
            active: true, // Default to true, but you can adjust as needed
            tags: "",
            category: "",
            specifications: [],
          });
        })
        .catch((err) => {
          console.error("Error creating product:", err);
          alert("Failed to create product");
        });
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };
  //   console.log("Product created:", newProduct);
  return (
    <div>
      {/* Button to trigger the modal */}
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create New Product
      </Button>

      {/* Modal (Dialog) */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        closeAfterTransition={false}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Product</h2>
        </div>
        <DialogContent>
          {" "}
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <TextField
                    label="Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <TextField
                    label="Description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    fullWidth
                    multiline
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <TextField
                      label="Price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      fullWidth
                    />
                  </div>

                  <div>
                    {" "}
                    <TextField
                      label="Stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      fullWidth
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <TextField
                      label="SKU"
                      value={newProduct.sku}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                      fullWidth
                    />
                  </div>

                  <div>
                    <FormControl fullWidth>
                      <InputLabel shrink>Category</InputLabel>
                      <Select
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div>
                  <h3>Specifications</h3>
                  {newProduct.specifications.map((spec, specIndex) => (
                    <div key={specIndex} className="mb-4 border p-4 rounded-lg">
                      <TextField
                        label="Specification Name. i.e. Size, Color"
                        value={spec.specName}
                        onChange={(e) => {
                          const updatedSpecs = [...newProduct.specifications];
                          updatedSpecs[specIndex].specName = e.target.value;
                          setNewProduct({
                            ...newProduct,
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
                              const updatedSpecs = [
                                ...newProduct.specifications,
                              ];
                              updatedSpecs[specIndex].options[
                                optionIndex
                              ].value = e.target.value;
                              setNewProduct({
                                ...newProduct,
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
                              const updatedSpecs = [
                                ...newProduct.specifications,
                              ];
                              updatedSpecs[specIndex].options[
                                optionIndex
                              ].price = e.target.value;
                              setNewProduct({
                                ...newProduct,
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
                              const updatedSpecs = [
                                ...newProduct.specifications,
                              ];
                              updatedSpecs[specIndex].options[
                                optionIndex
                              ].stock = e.target.value;
                              setNewProduct({
                                ...newProduct,
                                specifications: updatedSpecs,
                              });
                            }}
                            fullWidth
                          />
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              const updatedSpecs = [
                                ...newProduct.specifications,
                              ];
                              if (
                                updatedSpecs[specIndex].options.length === 1
                              ) {
                                updatedSpecs.splice(specIndex, 1);
                              } else {
                                updatedSpecs[specIndex].options.splice(
                                  optionIndex,
                                  1
                                );
                              }
                              setNewProduct({
                                ...newProduct,
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
                            const updatedSpecs = [...newProduct.specifications];
                            updatedSpecs[specIndex].options.push({
                              value: "",
                              price: 0,
                              stock: 0,
                            });
                            setNewProduct({
                              ...newProduct,
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
                            const updatedSpecs = [...newProduct.specifications];
                            updatedSpecs.splice(specIndex, 1);
                            setNewProduct({
                              ...newProduct,
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
                      setNewProduct({
                        ...newProduct,
                        specifications: [
                          ...newProduct.specifications,
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
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
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
                  {/* show user what have been uploaded  */}
                  {files.length > 0 && (
                    <div className="flex flex-wrap">
                      {files.map((file, index) => (
                        <div className="flex flex-col items-center justify-center w-24 h-24 m-2 bg-red-400 rounded-lg">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          <button
                            className="text-white "
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.active}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label>Active</label>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="p-4 flex justify-end">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleCreateProduct}
            >
              Create Product
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateProductForm;
