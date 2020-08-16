const functions = require("firebase-functions");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { check } = require("express-validator");
const FBAuth = require("./utils/auth");

dotenv.config();

// handlers imports
const {
  getAllCases,
  postOneCase,
  postATip,
  updateCaseStatus,
} = require("./routes/cases");
const {
  signup,
  login,
  getAuthenticatedUser,
  signupAdmin,
} = require("./routes/users");

const { uploadImage } = require("./routes/products");
const mongoAuth = require("./utils/mongo");

//===================== cases routes=======================//

// TODO:add middleware for admin only

app.get("/admin/getAllCases", getAllCases);
//TODO all middlewares for admins
app.patch(
  "/admin/updateCaseStatus",
  [
    check("id", "please provide case id").not().isEmpty(),
    check("status", "please provide case status").not().isEmpty(),
  ],
  updateCaseStatus
);

app.post(
  "/postOneCase",
  [
    [
      // check("obNumber", "obNumber is required").not().isEmpty(),
      // check("policeStation", "please provide a police station").not().isEmpty(),
      check("location", "please provide a location").not().isEmpty(),
      check("title", "please provide a title").not().isEmpty(),
    ],
    FBAuth,
  ],
  postOneCase
);

app.post(
  "/postATip",
  [
    [
      check("area", "area is required").not().isEmpty(),
      check("policeStation", "please provide a police station").not().isEmpty(),
      check("location", "please provide a location").not().isEmpty(),
      check("title", "please provide a title").not().isEmpty(),
      check("description", "please provide a description").not().isEmpty(),
    ],
    FBAuth,
  ],
  postATip
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

// signup
app.post(
  "/admin/signup",
  [
    check("email", "enter a valid email").isEmail(),
    check("password", "enter password with 8 or more characters")
      .exists()
      .isLength({ min: 8, max: 255 }),
    check("phoneNumber", "please provide a phonenumber").exists(),
    check("surname", "surname is required").exists(),
    check("firstName", "firstname is required").exists(),
    check("idNumber", "id number is required").exists(),
  ],
  signupAdmin
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

// ========================== products==================================//
app.patch("/products/:id/upload", mongoAuth, uploadImage);

exports.api = functions.region("europe-west3").https.onRequest(app);
