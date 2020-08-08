const express = require("express");

const router = express.Router();

const shiftFormsController = require("../controllers/shift-forms-controller");

const auth = require("./middleware/auth");

router.post("/", shiftFormsController.create);
router.patch("/:fId", shiftFormsController.update);

router.get("/:year/:month", shiftFormsController.getByMonth); // queries: placement
router.get("/:year/:month/:day/:shift", shiftFormsController.get); // queries: placement

// Download shift forms between two dates (.xlsx format(workbook) / .pdf(individual files) with sales report)
router.get("/download", shiftFormsController.download); // queries: placement
module.exports = router;
