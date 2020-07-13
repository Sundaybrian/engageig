const { admin } = require("../utils/admin");

const FBAuth = (req, res, next) => {
  let idToken = req.header("auth-token");

  if (!idToken) {
    console.error("no token found");
    return res.status(403).json({ error: "No token found,Unauthorized" });
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
