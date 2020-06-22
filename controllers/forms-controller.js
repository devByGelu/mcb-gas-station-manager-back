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
exports.getByDate = async (req, res, next) => {
  const { year, month} = req.params
  const queryString =
    'SELECT f.date, f.shift, f.placement, f.eId, f.fId, af.fId attendance_form_fId, arf.fId advance_reading_form_fId, drf.fId dipstick_reading_form_fId, df.fId drop_form_fId, ef.fId expense_form_fId FROM form f LEFT JOIN attendance_form af ON f.fId = af.fId LEFT JOIN advance_reading_form arf ON f.fId = af.fId LEFT JOIN dipstick_reading_form drf ON f.fId = drf.fId LEFT JOIN drop_form df ON f.fId = df.fId LEFT JOIN expense_form ef ON f.fId = ef.fId WHERE YEAR(f.date) = ? AND MONTH(f.date) = ?'
  sql.query(queryString,[year,month], function (error, results, fields) {
    if (error) res.status(500).send(error)
    res.send(results)
  })
}
exports.createGroup5 = async (req, res, next) => {
  try {
    // Daily
    const { fId } = req.body
    const expenseForm = new ExpenseForm({ fId })
    await ExpenseForm.create(expenseForm)

    const { expenses } = req.body
    expenses.forEach(async (exp) => {
      const { description, amount } = exp
      const expense = new Expense({ fId, description, amount })
      await Expense.create(expense)
    })
    // Credit Sales
    const { creditsales, date } = req.body
    creditsales.forEach(async (sale) => {
      const { customer, amount } = sale
      const creditSale = new CreditSale({ customer, amount, date, fId })
      await CreditSale.create(creditSale)
    })

    const { cashadvance } = req.body
    cashadvance.forEach(async (ca) => {
      const { employee, amount } = ca
      const eId = employee
      const cashAdvance = new CashAdvance({ eId, fId, amount })
      await CashAdvance.create(cashAdvance)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error })
  }
}
exports.createGroup4 = async (req, res, next) => {
  try {
    const {
      fId,
      numOfDrops,
      amtPerDrop,
      lastDrop,
      lastDropBreakdown,
    } = req.body
    const dropform = new DropForm({ fId })
    await DropForm.create(dropform)
    const drop = new Drop({ fId, numOfDrops, amtPerDrop, lastDrop })
    await Drop.create(drop)
    lastDropBreakdown.forEach(async (breakDown) => {
      const lastDropBreakdown = new LastDropBreakdown({
        denomination: breakDown.denomination,
        quantity: breakDown.quantity,
        fId,
      })
      await LastDropBreakdown.create(lastDropBreakdown)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error })
  }
}
exports.createGroup3 = async (req, res, next) => {
  try {
    const { dipstick, fId } = req.body
    // Create DRF
    const dipstickReadingForm = new DipstickReadingForm({ fId })
    await DipstickReadingForm.create(dipstickReadingForm)
    // Insert Readings
    dipstick.forEach(async (product, index) => {
      const pName =
        index === 0 ? 'diesel' : index === 1 ? 'accelrate' : 'jxpremium'
      const {
        openingLevel,
        openingLiters,
        closingLevel,
        closingLiters,
      } = product
      const dipstickReading = new DipstickReading({
        pName,
        fId,
        openingLevel,
        openingLiters,
        closingLevel,
        closingLiters,
      })
      await DipstickReading.create(dipstickReading)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error })
  }
}
exports.createGroup2 = async (req, res, next) => {
  try {
    const { fId } = req.body
    // Create advance reading form
    const advanceReadingForm = new AdvanceReadingForm({ fId })
    await AdvanceReadingForm.create(advanceReadingForm)
    // // Select pump products for reading
    // const pumpProducts = await PumpProduct.getByfId(fId)
    // Insert into advance reading table
    const { advanceReading } = req.body
    advanceReading.forEach(async (read, index) => {
      const pumpNum = index + 1
      const pumpGroupNum = await Pump.getGroup(pumpNum)
      const { placement, date } = req.body

      const arDiesel = new AdvanceReading({
        pumpNum,
        pumpGroupNum,
        pName: 'diesel',
        fId,
        placement,
        date,
        advance_reading_form_fId: fId,
        reading: read.diesel,
      })

      const arAccelrate = new AdvanceReading({
        pumpNum,
        pumpGroupNum,
        pName: 'accelrate',
        fId,
        placement,
        date,
        advance_reading_form_fId: fId,
        reading: read.accelrate,
      })

      const arJxpremium = new AdvanceReading({
        pumpNum,
        pumpGroupNum,
        pName: 'jxpremium',
        fId,
        placement,
        date,
        advance_reading_form_fId: fId,
        reading: read.jxpremium,
      })

      await AdvanceReading.create(arDiesel)
      await AdvanceReading.create(arAccelrate)
      await AdvanceReading.create(arJxpremium)
    })
    res.json({ message: 'success group2' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error })
  }
}
exports.createGroup1 = async (req, res, next) => {
  try {
    // ATTENDANCE
    // First insert new form X
    const { fId, placement, date } = req.body
    // const form = new Form({ eId, placement, date, shift })
    // const result = await Form.create(form)
    // const fId = result.insertId
    // Then insert attendance_form
    const attendanceForm = new AttendanceForm({ fId })
    await AttendanceForm.create(attendanceForm)
    // Insert attendance form employee
    const { employees } = req.body
    employees.forEach(async (employee) => {
      const { eId, role } = employee
      const attendanceFormEmployee = new AttendanceFormEmployee({
        fId,
        eId,
        role,
      })
      await AttendanceFormEmployee.create(attendanceFormEmployee)
    })
    // PUMP PRICES
    const { pumpPrices } = req.body
    pumpPrices.forEach(async (pumpGroup, index) => {
      const pumpGroupNum = index + 1
      const pNames = ['diesel', 'accelrate', 'jxpremium']
      pNames.forEach(async (p, index) => {
        const price =
          index === 0
            ? pumpGroup.diesel
            : index === 1
            ? pumpGroup.accelrate
            : pumpGroup.jxpremium
        const pumpGroupPrice = new PumpGroupPrice({
          pumpGroupNum,
          pName: p,
          placement,
          date,
          price,
        })
        await PumpGroupPrice.create(pumpGroupPrice)
      })
    })

    // LITERS
    // Insert liters form first
    const pumpLitersForm = new PumpLitersForm({ fId, date })
    await PumpLitersForm.create(pumpLitersForm)
    //
    const { pumpLiters } = req.body
    pumpLiters.forEach(async (pump, index) => {
      const pumpNum = index + 1
      const pumpGroupNum = await Pump.getGroup(pumpNum)
      // For diesel
      const diesel = new PumpProduct({
        pumpNum,
        pumpGroupNum,
        pName: 'diesel',
        fId,
        placement,
        date,
        end: pump.DieselEND,
        cal: pump.DieselCAL,
        mgn: pump.DieselMGN,
      })
      await PumpProduct.create(diesel)
      //  For accelrate
      const accelrate = new PumpProduct({
        pumpNum,
        pumpGroupNum,
        pName: 'accelrate',
        fId,
        placement,
        date,
        end: pump.AccelrateEND,
        cal: pump.AccelrateCAL,
        mgn: pump.AccelrateMGN,
      })
      await PumpProduct.create(accelrate)
      // For jxpremium
      const jxpremium = new PumpProduct({
        pumpNum,
        pumpGroupNum,
        pName: 'jxpremium',
        fId,
        placement,
        date,
        end: pump.JxPremiumEND,
        cal: pump.JxPremiumCAL,
        mgn: pump.JxPremiumMGN,
      })
      await PumpProduct.create(jxpremium)
    })
    res.status(200).send({message:'success'})
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error })
  }
}
