const sql = require("../models/db");
const Customer = require("../models/Customer");
exports.getCustomers = async (req, res, next) => {
  try {
    const result = await Customer.getAll();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};
