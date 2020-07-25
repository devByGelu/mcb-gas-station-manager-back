const express = require("express");

const router = express.Router();

const expenseCategoriesController = require("../controllers/expense-categories-controller");

router.get("/", expenseCategoriesController.getExpenseCategories);

module.exports = router;
