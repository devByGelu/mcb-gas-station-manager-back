const sql = require("../models/db")
const Form = require("../models/Form")
const AttendanceForm = require("../models/AttendanceForm")
const AttendanceFormEmployee = require("../models/AttendanceFormEmployee")
const PumpGroupPrice = require("../models/PumpGroupPrice")
const Pump = require("../models/Pump")
const PumpProduct = require("../models/PumpProduct")
const PumpLitersForm = require("../models/PumpLitersForm")
const AdvanceReading = require("../models/AdvanceReading")
const AdvanceReadingForm = require("../models/AdvanceReadingForm")
const DipstickReading = require("../models/DipstickReading")
const DipstickReadingForm = require("../models/DipstickReadingForm")
const Drop = require("../models/drop")
const DropForm = require("../models/DropForm")
const LastDropBreakdown = require("../models/LastDropBreakdown")
const Expense = require("../models/Expense")
const ExpenseForm = require("../models/ExpenseForm")
const CreditSale = require("../models/CreditSale")
const CashAdvance = require("../models/CashAdvance")
exports.delete = async (req, res, next) => {
  try {
    const { fId } = req.params
    const result = await Form.delete(fId)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "something went wrong", error })
  }
}
exports.create = async (req, res, next) => {
  try {
    const { month, year, day, placement, eId, shift } = req.body
    console.log(req.body)
    const date = `${year}-${month}-${day}`
    const form = new Form({ eId, placement, date, shift })
    const result = await Form.create(form)
    const queryString =
      "SELECT f.date, f.shift, f.placement, f.eId, f.fId, af.fId attendance_form_fId, arf.fId advance_reading_form_fId, drf.fId dipstick_reading_form_fId, df.fId drop_form_fId, ef.fId expense_form_fId FROM form f LEFT JOIN attendance_form af ON f.fId = af.fId LEFT JOIN advance_reading_form arf ON f.fId = af.fId LEFT JOIN dipstick_reading_form drf ON f.fId = drf.fId LEFT JOIN drop_form df ON f.fId = df.fId LEFT JOIN expense_form ef ON f.fId = ef.fId WHERE f.fId = ?"
    sql.query(queryString, [result.insertId], function (
      error,
      results,
      fields
    ) {
      if (error) res.status(500).send(error)
      res.status(200).send(results)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "something went wrong", error })
  }
}

exports.getByDate = async (req, res, next) => {
  const { year, month } = req.params
  const queryString = "w"
  sql.query(queryString, [year, month], function (error, results, fields) {
    if (error) res.status(500).send(error)
    res.send(results)
  })
}
