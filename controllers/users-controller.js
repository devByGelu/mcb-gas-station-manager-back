const User = require("../models/User");
const sql = require("../models/db");

exports.registerUser = async (req, res, next) => {
  const { uName, password } = req.body;
  try {
    const user = new User({ uName, password });
    const result = await User.create(user);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
