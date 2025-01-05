const express = require("express"); //Line 1
const app = express(); //Line 2
const cors = require("cors");
const path = require("path");
const { ClientModel } = require("./Model/User.js");
app.use(express.static(path.join(__dirname, "../build")));
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
require("dotenv").config();
const mongoString = process.env.DATABASE_URL;
app.use(express.json());
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 3001; //Line 3

mongoose.connect(mongoString, {
  useNewUrlParser: true,
});
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

const corsOptions = {
  origin: true, //access-control-allow-origin
  credentials: true, //access-control-allow-credentials:true
  exposedHeaders: ["set-cookie"],
  optionSuccessStatus: 200,
};

app.use(function (req, res, next) {
  console.log("req", req.path);
  next();
});

app.use(cors(corsOptions));

// make new api for server health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.use(async function (req, res, next) {
  var whitelist = [
    "login",
    "forgot",
    "resetpassword",
    "signup",
    "logout",
    "forgotusername",
    "forgotpassword",
    "token_validation_check",
    "token",
    "validateResetToken",
    "auth",
  ];
  var isInWhitelist = false;
  for (var i = 0; i < whitelist.length; i++) {
    if (req.path.includes(whitelist[i])) {
      isInWhitelist = true;
      break;
    }
  }
  console.log("whitelist", req.get("host"));
  console.log("whitelist", process.env.HOSTWHITELIST.split(","));
  console.log("whitelist", req.get("host"));
  if (
    isInWhitelist ||
    process.env.HOSTWHITELIST.split(",").includes(req.get("host"))
  ) {
    next();
  } else {
    if (req.headers.cookie) {
      var user_data = JSON.parse(
        decodeURIComponent(req.headers.cookie).split("USER-SESSION=j:")[1]
      );
      console.log("user_data", user_data);
      const validate_user = async (user_data) => {
        var auth_token = user_data["auth_token"];

        //decode token
        var decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
        console.log("decoded", decoded);
        //check if user exists
        var user = await ClientModel.findOne({
          _id: decoded._id,
        }).catch((err) => {
          res.status(401).send("Access denied");
        });

        if (user) {
          // check if user = user_data on  _id, firstname, lastname, email, usertype, password
          if (
            user._id == user_data._id &&
            user.first_name == user_data.first_name &&
            user.last_name == user_data.last_name &&
            user.email == user_data.email &&
            user.usertype == user_data.usertype &&
            user.password == user_data.password
          ) {
            return true;
          } else {
            return false;
          }
        }
      };
      var valid = await validate_user(user_data).catch((err) => {
        console.log(err);
      });
      if (valid) {
        next();
      } else {
        //this means jwt expired
        res.status(401).send("Access denied");
      }
    } else {
      //block express apis
      if (req.path.includes("Express")) {
        res.status(401).send("Access denied");
      } else {
        //redirect user to login
        res.status(401).redirect("/login/?next=" + req.path);
        console.log("redirecting to login");
      }
    }
  }
});
const user = require("./Routes/userapi_routes.js");
const authRouter = require("./Routes/authRoutes");
const stripeRouter = require("./Routes/stripe");
const productRouter = require("./Routes/product_routes");
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
// app.use("/", (req, res) => res.send("Hello World!"));
app.use("/userExpress", user);
app.use("/auth", authRouter);
app.use("/stripe", stripeRouter);
app.use("/productExpress", productRouter);

// log all errors

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
