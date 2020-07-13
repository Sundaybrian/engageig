const { db } = require("../utils/admin");
const firebase = require("firebase");
const { validationResult } = require("express-validator");

firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
});

exports.getAllCases = (req, res) => {
  db.collection("cases")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let cases = [];

      data.forEach((doc) => {
        cases.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.status(200).json(cases);
    })
    .catch((error) => res.status(500).json(error));
};

exports.postOneCase = (req, res) => {
  const { phoneNumber, obNumber, description, policeStation } = req.body;

  const newCase = {
    email: req.user.email,
    userId: req.user.user_id,
    phoneNumber,
    obNumber,
    description,
    policeStation,
    creaateAt: new Date().toISOString(),
    status: pending,
  };

  // persist case to db
  db.collection("cases")
    .add(newCase)
    .then((doc) => {
      return res.status(201).json({ ...newCase, id: doc.id });
    })
    .catch((error) => res.status(500).json(error));
};
