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
      });
    })
    .then(() => res.status(201).json({ token }))
    .catch((error) => res.json({ error }));
};
