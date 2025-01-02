require("dotenv").config();
const express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
// const nodemailer = require("nodemailer");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
// const jwt = require("jsonwebtoken");
// const mongo = require("mongodb");
// const fs = require("fs");
// const path = require("path");
// const User = require("../Model/User");
// const generateAuthToken = require("../utils/generateAuthToken");
// const Joi = require("joi");
// const bcrypt = require("bcrypt");
// const CRYPTO = require("crypto");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const { Readable } = require("stream");

var bodyParser = require("body-parser");
const Product = require("../Model/Product");
const Category = require("../Model/Category");
var jsonParser = bodyParser.json();
// const upload = multer({ dest: "uploads/" });

var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
);

// Set up multer for file uploads
const upload = multer();

// Set up AWS credentials
// https://objectivefs.com/howto/how-to-get-amazon-s3-keys
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Define a route to handle file uploads
router.post(
  "/uploadProductImage",
  jsonParser,
  upload.array("file"),
  async function (req, res, next) {
    console.log("--------------------------");
    try {
      if (req.files) {
        const validFiles = req.files.filter(
          (file) =>
            file.mimetype === "image/jpeg" || file.mimetype === "image/png"
        );
        if (validFiles.length === req.files.length) {
          //check files is a list if not make it one
          if (!Array.isArray(req.files.file)) {
            req.files.file = [req.files.file];
          }
          const uploadedFiles = [];
          for (const file of req.files) {
            var folder_name = "product/" + req.body.product_id;
            var params = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: folder_name,
            };
            params.Key =
              folder_name +
              "/" +
              new Date().getTime().toString() +
              file.originalname.replace(/ /g, "-");
            await s3Client.send(
              new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: params.Key,
                Body: file.buffer,
              })
            );
            uploadedFiles.push(params.Key);
            console.log("File uploaded successfully");

            console.log("file", params);
            //--------------------------
          }
          console.log("uploadedFiles", uploadedFiles);
          // return all the files/keys uploaded

          // update the product with the new image
          const product = await Product.findByIdAndUpdate(
            req.body.product_id,
            { images: uploadedFiles },
            { new: true }
          ).exec();
          res.status(200).json({ message: "Files uploaded", product: product });
        } else {
          return res.status(400).send("Invalid file type");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
    //cURL
  }
);

// route to get a file from S3 with a given key
router.get("/getfile", async function (req, res, next) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.query.key,
    };
    const data = await s3Client.send(new GetObjectCommand(params));
    const stream = Readable.from(data.Body);
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to get file");
  }
});

// route to delete a file from S3 with a given key
router.delete("/deletefile", async function (req, res, next) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.query.key,
    };
    await s3Client.send(new DeleteObjectCommand(params));
    res.status(200).send("File deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete file");
  }
});

// delete all files in a folder but not the folder itself
router.delete("/deletefolder", async function (req, res, next) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: req.query.folder,
    };
    const listParams = {
      Bucket: params.Bucket,
      Prefix: params.Prefix,
    };
    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );
    if (listedObjects.Contents.length === 0) {
      return res.status(200).send("No files to delete");
    }

    const deleteParams = {
      Bucket: params.Bucket,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    const data = await s3Client.send(new DeleteObjectsCommand(deleteParams));

    data.Deleted.forEach((file) => {
      console.log("Deleted: ", file.Key);
    });
    res.status(200).send("Files deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete files");
  }
});

// POST /api/products - Create a product
router.post("/createProducts", jsonParser, async (req, res) => {
  try {
    console.log("req.body", req.body);
    const {
      name,
      description,
      price,
      stock,
      sku,
      active,
      //   tags,
      category,
      specifications,
    } = req.body;

    // Validate required fields
    if (!name || !price || !stock || !sku || !category) {
      return res.status(400).json({
        message: "Name, price, stock, SKU, and category are required fields.",
      });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      sku,
      active,
      //   tags,
      category,
      specifications,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
});

// GET /api/products - Fetch all products
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category = "" } = req.query;

    const query = {
      name: { $regex: search, $options: "i" }, // Case-insensitive search
      ...(category && { category }),
    };

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

// GET /api/products/:id - Fetch a single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
});

// PUT /api/products/:id - Update a product
router.put("/products/:id", jsonParser, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
});

// get all categories
router.get("/categories", async (_, res) => {
  try {
    const categories = await Category.find().exec();
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
