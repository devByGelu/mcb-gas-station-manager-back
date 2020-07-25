const express = require("express");

const router = express.Router();

const customersController = require("../controllers/customers-controller");

router.get("/", customersController.getCustomers);
module.exports = router;
