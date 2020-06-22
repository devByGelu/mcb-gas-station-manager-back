
const express = require('express')

const router = express.Router()

const formController = require('../controllers/form-controller')

// router.post('/attendance', formsController.createAttendance)
router.get('/month', formController.getByMonth)

module.exports = router
