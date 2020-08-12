require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getFormattedErrors, getErrors } = require("../errors");

const { validationResult } = require("express-validator");
exports.authenticate = async (req, res, next) => {
  try {
    const result = getFormattedErrors(req);
    const errors = getErrors(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: result.mapped() });

    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ errors: { _error: "Unauthorized." } });
    }
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.user = decodedToken;
      return next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
