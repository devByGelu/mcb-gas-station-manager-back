const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth-controller");
const { authenticate } = require("./middleware/auth");

// Used when loggin in, checks uName and password, generates token
router.post("/", authController.auth);
// Used to get the info of the user using uName
// Authenticates web token first
router.get("/user", authenticate, authController.getUser);

module.exports = router;
