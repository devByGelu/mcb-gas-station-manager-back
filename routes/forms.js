const express = require("express")

const router = express.Router()

const formsController = require("../controllers/forms-controller")

// router.post('/attendance', formsController.createAttendance)
router.get("/group1", formsController.getGroup1)
router.get("/group2", formsController.getGroup2)
router.get("/group3", formsController.getGroup3)
router.get("/group4", formsController.getGroup4)
router.get("/group5", formsController.getGroup5)

router.post("/group1", formsController.createGroup1)
router.post("/group2", formsController.createGroup2)
router.post("/group3", formsController.createGroup3)
router.post("/group2", formsController.createGroup2)
router.post("/group4", formsController.createGroup4)
router.post("/group5", formsController.createGroup5)
router.get("/:year/:month", formsController.getByDate)
module.exports = router
