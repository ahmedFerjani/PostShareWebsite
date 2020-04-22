const express = require("express");
const User = require("../models/user");
const router = express.Router();
const userController = require("../controllers/user");
//install bcrypt to crypt password
router.post("/signup", userController.userSignup);

router.post("/login", userController.userLogin);

module.exports = router;
