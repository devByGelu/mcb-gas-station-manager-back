const sql = require("../models/db");
const ExpenseCategory = require("../models/ExpenseCategory");
exports.getExpenseCategories = async (req, res, next) => {
  try {
    const result = await ExpenseCategory.getAll();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};
