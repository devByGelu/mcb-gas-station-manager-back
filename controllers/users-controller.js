const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sql = require("../models/db");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const { validationResult } = require("express-validator");
const { getErrors, getFormattedErrors } = require("../routes/errors");

exports.registerUser = async (req, res, next) => {
  try {
    const result = getFormattedErrors(req);
    const errors = getErrors(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: result.mapped() });

    const { uName, password, lName, mInit, fName, nickName } = req.body;

    let token = jwt.sign({ uName }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = new User({ uName, password: encryptedPassword });
    await User.create(user);
    await Employee.create({
      lName,
      mInit,
      fName,
      nickName,
      uName,
    });
    res.status(200).json({
      user: {
        uName,
        password,
        lName,
        mInit,
        fName,
        nickName,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
