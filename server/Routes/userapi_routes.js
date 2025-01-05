require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
var router = express.Router();

const SHA224 = require("sha224");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const CRYPTO = require("crypto");
// const nodemailer = require("nodemailer");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const jwt = require("jsonwebtoken");
const mongo = require("mongodb");
const fs = require("fs");
const path = require("path");
const User = require("../Model/User");
const generateAuthToken = require("../utils/generateAuthToken");
const Joi = require("joi");

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

// route test email style
router.post("/testEmail/", jsonParser, async function (req, res, next) {
  fs.readFile(
    path.join(__dirname, "../Email/resetPassEmailTemplate.html"),
    "utf8",
    async (err, html) => {
      if (err) {
        return console.log(err);
      }
      var user = {};
      await ClientModel.findOne({
        _id: req.body._id,
      })
        .then((response) => {
          user = response;
        })
        .catch((err) => {
          console.log("err", err);
          return res;
        });
      const mailData = {
        from: '"YD Auto Group" process.env.EMAIL',
        to: user.email,
        subject: "Welcome to YD Auto Group VIP",
        // text: `Welcome to ydVIP, ${req.body.first_name}!`,
        html: html.replace("${recipientName}", user.first_name),
        // .replace("${recipientEmail}", user.email)
        // .replace("${recipientFirstName}", user.first_name)
        // .replace("${recipientLastName}", user.last_name)
        // .replace("${websiteUrl}", process.env.CLIENTURL)
        attachments: [
          {
            filename: "ydlogoblack.png",
            path: path.join(__dirname, "../Email/Assets/ydlogoblack.png"),
            cid: "logo",
          },
        ],
      };

      transport.sendMail(mailData, function (err, info) {
        if (err) console.log(err);
        else console.log(info);
      });

      res.status(200).json({ message: "Email sent" });
      return res;
    }
  );

  //curl -X POST -H "Content-Type: application/json" -d '{"email": " ", "first_name": "John"}' http://localhost:3000/userExpress/testEmail/
});

// login
router.post("/login", jsonParser, async function (req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email,
  }).select("+password");

  if (!user) return res.status(400).send("Invalid email or password...");

  if (user.password) {
    console.log("user.password", user);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid email or password...");
    }
  } else {
    return res.status(400).send("Invalid email or password...");
  }

  const token = generateAuthToken(user);

  res.send(token);
});

// register
router.post("/register", jsonParser, async function (req, res, next) {
  // this is a template project , only email and password are for sure required, you can add more fields as needed
  const userObj = {};

  // loop req.body to add more fields
  for (const [key, value] of Object.entries(req.body)) {
    userObj[key] = value;
  }

  if (!userObj.email || !userObj.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  await User.create(userObj)
    .then((response) => {
      res.status(200).json({ message: "success", data: response });
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(500)
        .json({ message: "Internal server error", data: err.message });
    });
});

// forgot password
router.post("/forgotPassword", jsonParser, async function (req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return res.status(400).send("User not found...");

  const resetToken = generateAuthToken(user);

  user.resetPasswordToken = resetToken;
  await user.save();

  const resetURL = `${process.env.CLIENTURL}/reset-password/${resetToken}`;

  const mailData = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password reset",
    text: `To reset your password, please click the link below:\n${resetURL}`,
  };

  transport.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });

  res.status(200).json({ message: "Email sent" });
});

// reset password
router.post(
  "/resetPassword/:resetToken?",
  jsonParser,
  async function (req, res, next) {
    const schema = Joi.object({
      password: Joi.string().min(6).max(200).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({
      resetPasswordToken: req.params.resetToken,
    });

    if (!user) return res.status(400).send("Invalid token");

    user.password = req.body.password;
    user.resetPasswordToken = null;
    await user.save();

    res.status(200).json({ message: "Password reset" });
  }
);
//

module.exports = router;
