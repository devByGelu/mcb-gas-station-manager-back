
const express = require('express')

const router = express.Router()

const formsController = require('../controllers/forms-controller')

// router.post('/attendance', formsController.createAttendance)
router.post('/group1', formsController.createGroup1)
router.post('/group2', formsController.createGroup2)
router.post('/group3', formsController.createGroup3)
router.post('/group4', formsController.createGroup4)
router.post('/group5', formsController.createGroup5)
router.get('/:year/:month', formsController.getByDate)
module.exports = router
