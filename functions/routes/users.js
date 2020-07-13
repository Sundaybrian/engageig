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

exports.signup = (req, res) => {
  //validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(422).json({ error: "passwords must match" });
  }

  let userId = "";
  let token = "";

  // create user

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      // return promise with user data
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((_token) => {
      token = _token;

      // persisting newly created user
      return db.doc(`/users/${email}`).set({
        email,
        userId,
        createdAt: new Date().toISOString(),
        isAdmin: false,
      });
    })
    .then(() => res.status(201).json({ token }))
    .catch((error) => res.json({ error }));
};

exports.login = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let token = "";

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((_token) => {
      token = _token;
      return res.status(200).json({
        token,
        email,
      });
    })
    .catch((error) => {
      if (error.code == "auth/wrong-password") {
        return res
          .status(403)
          .json({ error: "wrong credentials, please try again" });
      }
      return res.status(500).json(error);
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userDetails = {};

  db.doc(`/users/${req.user.email}`)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        userDetails.credentials = userDoc.data(); // populate user details

        // fetch their cases
        return db
          .collection("cases")
          .where("email", "==", req.user.email)
          .get();
      }
    })
    .then((data) => {
      userDetails.cases = [];

      data.forEach((doc) => {
        userDetails.cases.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json(userDetails);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "internal server error" });
    });
};
