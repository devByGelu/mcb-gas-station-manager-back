const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sql = require("../models/db");
const Employee = require("../models/Employee");
const { getFormattedErrors, getErrors } = require("../routes/errors");

exports.auth = async (req, res, next) => {
  try {
    const result = getFormattedErrors(req);
    const errors = getErrors(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: result.mapped() });

    const { uName } = req.body;
    const user = await User.find(uName);
    const loggedInEmployee = await Employee.findByUname(uName);

    let token = jwt.sign({ uName }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
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
