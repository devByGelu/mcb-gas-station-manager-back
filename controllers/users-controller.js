const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sql = require("../models/db");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");

exports.registerUser = async (req, res, next) => {
  try {
    const { uName, password, lName, mInit, fName, nickName } = req.body;
    const existingEmployee = Employee.findByUName(uName);
    if (existingEmployee)
      return res.status(404).json({ message: "Username taken." });
    let token = jwt.sign(
      { uName, password, lName, mInit, nickName },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      }
    );
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = bcrypt.hash(password, salt);
    const user = new User({ uName, password: encryptedPassword });
    await User.create(user);
    const employee = await Employee.create({
      lName,
      mInit,
      fName,
      nickName,
      uName,
    });
    res.status(200).json({
      user: {
        uName,
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
