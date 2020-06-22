const sql = require('../models/db')
const Form = require('../models/Form')
const AttendanceForm = require('../models/AttendanceForm')
const AttendanceFormEmployee = require('../models/AttendanceFormEmployee')
const PumpGroupPrice = require('../models/PumpGroupPrice')
const Pump = require('../models/Pump')
const PumpProduct = require('../models/PumpProduct')
const PumpLitersForm = require('../models/PumpLitersForm')
const AdvanceReading = require('../models/AdvanceReading')
const AdvanceReadingForm = require('../models/AdvanceReadingForm')
const DipstickReading = require('../models/DipstickReading')
const DipstickReadingForm = require('../models/DipstickReadingForm')
const Drop = require('../models/drop')
const DropForm = require('../models/DropForm')
const LastDropBreakdown = require('../models/LastDropBreakdown')
const Expense = require('../models/Expense')
const ExpenseForm = require('../models/ExpenseForm')
const CreditSale = require('../models/CreditSale')
const CashAdvance = require('../models/CashAdvance')
exports.getByMonth = async (req, res, next) => {
  try {
    const { month, year } = req.query
    console.log(req.query)
    const result = await Form.findByMonth(month, year)
    res.status(200).json({ result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'something went wrong', error })
    // res.json.send('bruh')
  }
}
