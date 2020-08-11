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

    // Generate token
    let token = jwt.sign({ uName }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    const loggedInEmployee = await Employee.findByUname(uName);

    res.status(200).json({
      user: { ...user[0], ...loggedInEmployee[0] },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

exports.getUser = async (req, res, next) => {
  const { uName } = req.user;
  let user;
  let employee;
  user = await User.find(uName);

  if (!user.length) return res.staus(400).send({ msg: "Username not found" });

  employee = await Employee.findByUname(uName);

  res.json(employee[0]);
};
