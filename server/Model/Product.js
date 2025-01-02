const mongoose = require("mongoose");
const { validate } = require("./User");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required."],
    min: [0, "Price must be a positive number."],
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required."],
    min: [0, "Stock cannot be negative."],
  },
  sku: {
    type: String,
    required: [true, "SKU is required."],
    unique: true,
    trim: true,
  },
  images: {
    type: [String], // Array of image URLs
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.every((url) => typeof url === "string");
      },
      message: "Images must be an array of strings (URLs).",
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  //   tags: {
  //     type: [String], // Tags to describe product features
  //     default: [],
  //   },
  categories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Reference to multiple Category documents
    required: [true, "Product must belong to at least one category."],
  },
  specifications: {
    type: [
      {
        specName: { type: String, required: true }, // e.g., "Size" or "Color"
        options: [
          {
            value: { type: String, required: true }, // e.g., "Small" or "Red"
            price: { type: Number, default: 0 }, // Price adjustment for this spec

            // Stock adjustment for this spec
            stock: {
              type: Number,
              default: 0,
              // Stock available for this option
            },
          },
        ],
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
