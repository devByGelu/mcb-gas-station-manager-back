const express = require("express");

const router = express.Router();

const customersController = require("../controllers/customers-controller");

const auth = require("./middleware/auth");
router.get("/", customersController.getCustomers);
module.exports = router;
