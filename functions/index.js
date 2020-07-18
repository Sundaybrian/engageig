const functions = require("firebase-functions");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { check } = require("express-validator");
const FBAuth = require("./utils/auth");

dotenv.config();

// handlers imports
const { getAllCases, postOneCase } = require("./routes/cases");
const { signup, login, getAuthenticatedUser } = require("./routes/users");

//===================== cases routes=======================//

// TODO:add middleware for admin only

app.get("/getAllCases", getAllCases);
app.post(
  "/postOneCase",
  [
    [
      check("obNumber", "obNumber is required").not().isEmpty(),
      check("policeStation", "please provide a police station").not().isEmpty(),
      check("location", "please provide a location").not().isEmpty(),
    ],
    FBAuth,
  ],
  postOneCase
);

//===================== signup routes =======================//
// signup
app.post(
  "/signup",
  [
    check("email", "enter a valid email").isEmail(),
    check("password", "enter password with 8 or more characters")
      .exists()
      .isLength({ min: 8, max: 255 }),
    check("phoneNumber", "please provide a phonenumber").exists(),
    check("surname", "surname is required").exists(),
    check("firstName", "firstname is required").exists(),
    check("idNumber", "id number is required").exists(),
    check("location", "locations is required").exists(),
  ],
  signup
);

//login
app.post(
  "/login",
  [
    check("email", "enter valid email").isEmail(),
    check("password", "password is required").exists(),
  ],
  login
);

app.get("/user/getAuthenticatedUser", FBAuth, getAuthenticatedUser);

exports.api = functions.region("europe-west3").https.onRequest(app);
