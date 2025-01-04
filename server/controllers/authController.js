const axios = require("axios");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const oauth2Client = require("../utils/oauth2client");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("../Model/User");
const generateAuthToken = require("../utils/generateAuthToken");
require("dotenv").config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT,
  });
};
// Create and send Cookie ->
// const createSendToken = (user, statusCode, res) => {
//   console.log("User -> ", user);
//   const token = signToken(user.id);

//   console.log(process.env.JWT_TIMEOUT);
//   const cookieOptions = {
//     expires: new Date(Date.now() + +process.env.JWT_TIMEOUT),
//     httpOnly: true,
//     path: "/",
//     // sameSite: "none",
//     secure: false,
//   };
//   if (process.env.NODE_ENV === "production") {
//     cookieOptions.secure = true;
//     cookieOptions.sameSite = "none";
//   }

//   user.password = undefined;

//   res.cookie("jwt", token, cookieOptions);

//   console.log(user);

//   res.status(statusCode).json({
//     message: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };
/* GET Google Authentication API. */
exports.googleAuth = catchAsync(async (req, res, next) => {
  const code = req.query.code;
  const googleRes = await oauth2Client.oauth2Client.getToken(code);
  oauth2Client.oauth2Client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );
  console.log("User -> ", userRes.data);

  let user = await User.findOne({ email: userRes.data.email });
  console.log("USER -> ", user);
  if (!user) {
    console.log("New User found");

    user = await User.create({
      name: userRes.data.name,
      email: userRes.data.email,
      //   image: userRes.data.picture,
    });
  }

  // extra filed for show its a google user
  user.isGoogleAuth = true;
  const token = generateAuthToken(user);

  res.status(200).json(token);

  // createSendToken(user, 201, res);
});
