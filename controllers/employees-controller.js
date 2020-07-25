const Employee = require('../models/Employee')

exports.getEmployees = async (req, res, next) => {
  try {
    const result = await Employee.getAll()
    console.log(result)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).send({ message: error })
  }
}
