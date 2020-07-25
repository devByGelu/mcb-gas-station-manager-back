const sql = require("../models/db");
const Products = require("../models/Product");
exports.getProducts = async (req, res, next) => {
  try {
    const result = await Products.getAll();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};
