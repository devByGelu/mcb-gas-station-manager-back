const express = require("express");

const router = express.Router();

const productsController = require("../controllers/products-controller");

const auth = require("./middleware/auth");
router.get("/", productsController.getProducts);
module.exports = router;
