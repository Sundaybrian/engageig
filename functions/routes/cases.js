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
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    phoneNumber,
    obNumber,
    description = "not provided",
    policeStation,
  } = req.body;

  const newCase = {
    email: req.user.email,
    userId: req.user.user_id,
    phoneNumber,
    obNumber,
    description,
    policeStation,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  // persist case to db
  db.collection("cases")
    .add(newCase)
    .then((doc) => {
      return res.status(201).json({ ...newCase, id: doc.id });
    })
    .catch((error) => res.status(500).json(error));
};
