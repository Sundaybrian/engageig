const { admin } = require("../utils/admin");

const FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorizations.split("Bearer ")[1];
  } else {
    console.error("no token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  // verify token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      //add data to request obj
      req.user = decodedToken;

      return next();
    })
    .catch((error) => res.status(403).json(error));
};

module.exports = FBAuth;
