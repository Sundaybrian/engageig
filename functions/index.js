const functions = require("firebase-functions");

const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const { check } = require("express-validator");

// handlers imports

const { signup } = require("./routes/users");
// const auth = require("./utils/auth");

//===================== cases roures=======================//

//===================== signup routes =======================//

// signup
app.post(
  "/signup",
  [
    check("email", "enter a valid email").isEmail(),
    check("password", "enter password with 8 or more characters")
      .exists()
      .isLength({ min: 8, max: 255 }),
    check("confirmPassword", "password length must be 8 characters or more")
      .exists()
      .isLength({ min: 8, max: 255 }),
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

exports.api = functions.region("europe-west3").https.onRequest(app);