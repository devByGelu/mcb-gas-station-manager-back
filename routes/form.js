
const express = require('express')

const router = express.Router()

const formController = require('../controllers/form-controller')

// router.post('/attendance', formsController.createAttendance)
router.post('/', formController.create)
router.delete('/:fId',formController.delete)
module.exports = router
