const { admin, db } = require("../utils/admin");

const mongoAuth = (req, res, next) => {
  let idToken = req.header("Authorization").replace("Bearer ", "");

  if (!idToken) {
    return res.status(403).json({ error: "No token found,Unauthorized" });
  }

  // verify token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // user is verified
      // verify product is a users TODO
      req.user = decodedToken;

      return next();
    })
    .catch((error) => res.status(403).json(error));
};

module.exports = mongoAuth;
