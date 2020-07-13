const functions = require("firebase-functions");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { check } = require("express-validator");
const FBAuth = require("./utils/auth");

dotenv.config();

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// handlers imports
const { signup, login } = require("./routes/users");

//===================== cases routes=======================//

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
