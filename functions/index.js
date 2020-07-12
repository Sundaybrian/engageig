const functions = require("firebase-functions");

const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const { check, validationResult } = require("express-validator");

// handlers imports

const { signup, login } = require("./routes/users");
const auth = require("./utils/auth");

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
    check("confirmPassword", "password is required")
      .exists()
      .isLength({ min: 8, max: 255 }),
  ],
  signup
);

exports.api = functions.region("europe-west3").https.onRequest(app);
