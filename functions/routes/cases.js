const { db } = require("../utils/admin");
const { validationResult } = require("express-validator");

exports.postOneCase = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    obNumber = null,
    description = "not provided",
    policeStation = null,
    location,
    title,
  } = req.body;

  const newCase = {
    email: req.user.email,
    userId: req.user.user_id,
    phoneNumber: req.user.phoneNumber,
    obNumber,
    title,
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

exports.postATip = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { area, policeStation, location, title, description } = req.body;

  const newTip = {
    area,
    policeStation,
    location,
    title,
    description,
    createdAt: new Date().toISOString(),
    status: "open",
  };

  // persist tip to db

  db.collection("tips")
    .add(newTip)
    .then((doc) => {
      return res.status(201).json({ ...newTip, id: doc.id });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

//============== admin functions =============================//

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

// update case status
exports.updateCaseStatus = (req, res) => {
  const { id, status } = req.body;

  db.docs(`/cases/${id}`)
    .update({ status })
    .then(() => {
      res
        .status(200)
        .json({ message: `case ${id} updated to status ${status}` });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};
