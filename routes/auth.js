const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth-controller");
const { authenticate } = require("./middleware/auth");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Check if username exists
async function validateUsername(uName) {
  const user = await User.find(uName);
  if (!user.length) return Promise.reject();
}
async function validatePassword(uName, { req }) {
  const user = await User.find(uName);
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user[0].password
  );
  if (!correctPassword) return Promise.reject();
}
// Used when loggin in, checks uName and password, generates token
router.post(
  "/",
  [
    body(["uName"])
      .custom(validateUsername)
      .withMessage("Username does not exist")
      .bail()
      .custom(validatePassword)
      .withMessage("Incorrect password"),
  ],
  authController.auth
);
// Used to get the info of the user using uName
// Authenticates web token first
router.get("/user", authenticate, authController.getUser);

module.exports = router;
