require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    if (!token)
      res.status(401).json({ message: "No token, authorization denied." });
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
