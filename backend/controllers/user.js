const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userSignup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = User.create({
      email: req.body.email,
      password: hash
    })
      .then(result => {
        res.status(201).json({
          message: "User created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  console.log("**************" + req.body.email);
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed: check email"
        });
      }

      return bcrypt.compare(req.body.password, user.password, function(
        compareError,
        compareResult
      ) {
        if (compareError) {
          return res.status(401).json({
            message: "Authentication failed: error with compare"
          });
        }

        if (compareResult) {
          const token = jwt.sign(
            {
              email: user.email,
              id: user.id
            },
            "secret_key_should_be_long_enough",
            { expiresIn: "1h" }
          );

          //Authentication succeeded
          return res.status(201).json({
            token: token,
            tokenExpires: "1800", //1 hour
            userId: user.id
          });
        }

        if (!compareResult) {
          return res.status(401).json({
            message: "authentication failed: wrong password"
          });
        }
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authentication failed",
        error: err
      });
    });
};
