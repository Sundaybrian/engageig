const { admin, db } = require("../utils/admin");

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

      // calling user collection and getting the phonenumber

      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      // add more data to user obj
      req.user.phoneNumber = data.docs[0].data().phoneNumber;
      // TODO soon image url

      return next();
    })
    .catch((error) => res.status(403).json(error));
};

module.exports = FBAuth;
