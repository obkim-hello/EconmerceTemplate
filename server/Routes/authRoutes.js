const express = require("express");
const authController = require("../controllers/authController");

const Router = express.Router();

Router.get("/google", authController.googleAuth);
//https://medium.com/@dugar_rishab/how-to-use-google-oauth-with-mern-stack-a988947e64f4
module.exports = Router;
