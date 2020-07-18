const { db } = require("../utils/admin");
const { validationResult } = require("express-validator");

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    obNumber,
    description = "not provided",
    policeStation,
    location,
  } = req.body;

  const newCase = {
    email: req.user.email,
    userId: req.user.user_id,
    phoneNumber: req.user.phoneNumber,
    obNumber,
    description,
    policeStation,
    location,
    createdAt: new Date().toISOString(),
    status: "open",
  };

  // persist case to db
  db.collection("cases")
    .add(newCase)
    .then((doc) => {
      return res.status(201).json({ ...newCase, id: doc.id });
    })
    .catch((error) => res.status(500).json(error));
};
