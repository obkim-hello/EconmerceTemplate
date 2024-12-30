require("dotenv").config();

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

// 

module.exports = router;
