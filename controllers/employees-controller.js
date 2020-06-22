const Employee = require('../models/Employee')

exports.getEmployees = async (req, res, next) => {
  try {
    res.status(200).json(await Employee.getAll())
  } catch (error) {
    res.status(500).send({ message: error })
  }
}
