const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sql = require("../models/db");
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
exports.auth = async (req, res, next) => {
  try {
    const { uName, password } = req.body;
    const user = await User.find(uName);
    // Check if username exists
    if (!user.length)
      return res.status(400).json({ msg: "User does not exist" });
    // Validate password
    const correctPassword = await bcrypt.compare(password, user[0].password);
    if (!correctPassword)
      return res.status(400).json({ msg: "Incorrect password" });

    res.status(200).json({ uName, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
