const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token : *******************" + token);
    const decodedToken = jwt.verify(token, "secret_key_should_be_long_enough");

    req.userData = { email: decodedToken.email, id: decodedToken.id };
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Authorization failed: should login first" });
  }
};
