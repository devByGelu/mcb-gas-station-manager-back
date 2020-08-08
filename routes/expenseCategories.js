const express = require("express");

const router = express.Router();

const expenseCategoriesController = require("../controllers/expense-categories-controller");

const auth = require("./middleware/auth");
router.get("/", expenseCategoriesController.getExpenseCategories);

module.exports = router;
