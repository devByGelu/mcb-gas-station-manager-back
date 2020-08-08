const express = require("express");

const router = express.Router();

const employeeController = require("../controllers/employees-controller");

const auth = require("./middleware/auth");

router.get("/", employeeController.getEmployees);
module.exports = router;
