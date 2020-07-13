const functions = require("firebase-functions");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { check } = require("express-validator");
const FBAuth = require("./utils/auth");

dotenv.config();

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Engage ig api",
      description: "Api for engage ig",
      contact: {
        name: "Sunday Brian",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/engageig-4f957/europe-west3/api/",
      },
    ],
  },
  apis: ["index.js"],
};

const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerDocument, { explorer: true }));

// handlers imports
const { getAllCases, postOneCase } = require("./routes/cases");
const { signup, login, getAuthenticatedUser } = require("./routes/users");

//===================== cases routes=======================//

// TODO:add middleware for admin only

app.get("/getAllCases", getAllCases);
app.post(
  "/postOneCase",
  [
    FBAuth,
    [
      check("phoneNumber", "phoneNumber is required").not().isEmpty(),
      check("obNumber", "obNumber is required").not().isEmpty(),
      check("policeStation", "please provide a police station").not().isEmpty(),
    ],
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

app.get("/user/getAuthenticatedUser", FBAuth, getAuthenticatedUser);

exports.api = functions.region("europe-west3").https.onRequest(app);
