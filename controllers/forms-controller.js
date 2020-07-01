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
const { response } = require("express")
exports.getByDate = async (req, res, next) => {
  const { year, month } = req.params
  const queryString =
    "SELECT f.date, f.shift, f.placement, f.eId, f.fId, af.fId attendance_form_fId, arf.fId advance_reading_form_fId, drf.fId dipstick_reading_form_fId, df.fId drop_form_fId, ef.fId expense_form_fId FROM form f LEFT JOIN attendance_form af ON f.fId = af.fId LEFT JOIN advance_reading_form arf ON f.fId = arf.fId LEFT JOIN dipstick_reading_form drf ON f.fId = drf.fId LEFT JOIN drop_form df ON f.fId = df.fId LEFT JOIN expense_form ef ON f.fId = ef.fId WHERE YEAR(f.date) = ? AND MONTH(f.date) = ?"
  sql.query(queryString, [year, month], function (error, results, fields) {
    if (error) res.status(500).send(error)
    res.send(results)
  })
}
exports.createGroup5 = async (req, res, next) => {
  try {
    const { fId } = req.body
    if (req.body.expenses) {
      // Check if nothing was passed
      // Daily
      const expenseForm = new ExpenseForm({ fId })
      await ExpenseForm.create(expenseForm)
      const { expenses } = req.body
      expenses.forEach(async (exp) => {
        const { description, amount } = exp
        const expense = new Expense({ fId, description, amount })
        await Expense.create(expense)
      })
    }
    if (req.body.creditsales) {
      // Credit Sales
      const { creditsales, date } = req.body
      creditsales.forEach(async (sale) => {
        const { customer, amount } = sale
        const creditSale = new CreditSale({ customer, amount, date, fId })
        await CreditSale.create(creditSale)
      })
    }
    if (req.body.cashadvance) {
      // Cash Advance
      const { cashadvance } = req.body
      cashadvance.forEach(async (ca) => {
        const { employee, amount } = ca
        const eId = employee
        const cashAdvance = new CashAdvance({ eId, fId, amount })
        await CashAdvance.create(cashAdvance)
      })
    }
    res.json({ message: "success success group 5" })
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
    res.json({ message: "success group4" })
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
        index === 0 ? "diesel" : index === 1 ? "jxpremium" : "accelrate"
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
    res.json({ message: "success group3" })
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
        pName: "diesel",
        fId,
        placement,
        date,
        advance_reading_form_fId: fId,
        reading: read.diesel,
      })

      const arAccelrate = new AdvanceReading({
        pumpNum,
        pumpGroupNum,
        pName: "accelrate",
        fId,
        placement,
        date,
        advance_reading_form_fId: fId,
        reading: read.accelrate,
      })

      const arJxpremium = new AdvanceReading({
        pumpNum,
        pumpGroupNum,
        pName: "jxpremium",
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
    res.json({ message: "success group2" })
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
      const pNames = ["diesel", "accelrate", "jxpremium"]
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
        pName: "diesel",
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
        pName: "accelrate",
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

        pName: "jxpremium",
        fId,
        placement,
        date,
        end: pump.JxPremiumEND,
        cal: pump.JxPremiumCAL,
        mgn: pump.JxPremiumMGN,
      })
      await PumpProduct.create(jxpremium)
    })
    res.status(200).send({ message: "success" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error })
  }
}
exports.getGroup5 = async (req, res, next) => {
  try {
    const { fId } = req.query
    const q1 = "SELECT * FROM `expense` WHERE fId = ?"
    const q2 = "SELECT eId, amount FROM `cash_advance` WHERE fId = ?"
    const q3 = "SELECT customer, amount FROM `credit_sale` WHERE fId = ?"
    sql.query(`${q1}; ${q2}; ${q3}`, [fId, fId, fId], function (
      error,
      results,
      fields
    ) {
      if (error) res.status(500).send(error)
      const response = {}
      // For expenses
      const expenses = []
      results[0].forEach((expense) => {
        const { description, amount } = expense
        expenses.push({ description, amount })
      })
      if (!expenses.length) expenses.push({})
      response.expenses = expenses
      // For cash advance
      const cashadvance = []
      results[1].forEach((payment) => {
        const { eId, amount } = payment
        cashadvance.push({ employee: eId, amount })
      })
      if (!cashadvance.length) cashadvance.push({})
      response.cashadvance = cashadvance
      // For credit sales
      const creditsales = []
      results[2].forEach((sale) => {
        let { customer, amount } = sale
        creditsales.push({ customer, amount })
      })
      if (!creditsales.length) creditsales.push({})
      response.creditsales = creditsales
      res.send(response)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
exports.getGroup4 = async (req, res, next) => {
  try {
    const { fId } = req.query
    const q1 = "SELECT * FROM `drop` WHERE fId = ?"
    const q2 =
      "SELECT denomination, quantity FROM `last_drop_breakdown` WHERE fId = ?"
    sql.query(`${q1}; ${q2}`, [fId, fId], function (error, results, fields) {
      if (error) res.status(500).send(error)
      const response = {}
      const { numOfDrops, amtPerDrop, lastDrop } = results[0][0]
      response.drops = numOfDrops
      response.amountPerDrop = amtPerDrop
      response.lastDrop = lastDrop
      // For last drop breakdown
      // const { numOfDrops, amtPerDrop, lastDrop } = results[1][0]
      const lastDropBreakdown = []
      results[1].forEach((row) => {
        const { denomination, quantity } = row
        lastDropBreakdown.push({ denomination, quantity })
      })
      response.lastDropBreakdown = lastDropBreakdown
      res.send(response)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
exports.getGroup3 = async (req, res, next) => {
  try {
    const { fId } = req.query
    const q1 =
      "SELECT pName,openingLevel,openingLiters,closingLevel,closingLiters FROM dipstick_reading WHERE fId = ?"
    sql.query(q1, [fId], function (error, results, fields) {
      if (error) res.status(500).send(error)
      const response = {}
      let dipstick = []
      let accelrate = {}
      let diesel = {}
      let jxpremium = {}
      const formFields = [
        "openingLevel",
        "openingLiters",
        "closingLevel",
        "closingLiters",
      ]
      results.forEach((el) => {
        if (el.pName == "diesel") {
          formFields.forEach((field) => (diesel[field] = el[field]))
        }
        if (el.pName == "accelrate") {
          formFields.forEach((field) => (accelrate[field] = el[field]))
        }
        if (el.pName == "jxpremium") {
          formFields.forEach((field) => (jxpremium[field] = el[field]))
        }
      })
      dipstick = [diesel, jxpremium, accelrate]
      response.dipstick = dipstick
      res.send(response)
    })
  } catch (error) {
    res.status(500).send("failed to get group 2")
  }
}
exports.getGroup2 = async (req, res, next) => {
  try {
    const { fId } = req.query
    const q1 = "SELECT pumpNum,pName,reading FROM advance_reading WHERE fId = ?"
    sql.query(q1, [fId], function (error, results, fields) {
      if (error) res.status(500).send(error)
      const response = {}
      let advanceReading = []
      let p1 = {}
      let p2 = {}
      let p3 = {}
      let p4 = {}
      results.forEach((el) => {
        if (el.pumpNum === 1) p1[el.pName] = el.reading
        if (el.pumpNum === 2) p2[el.pName] = el.reading
        if (el.pumpNum === 3) p3[el.pName] = el.reading
        if (el.pumpNum === 4) p4[el.pName] = el.reading
      })
      advanceReading = [p1, p2, p3, p4]
      response.advanceReading = advanceReading
      res.send(response)
    })
  } catch (error) {
    res.status(500).send("failed to get group 2")
  }
}

exports.getGroup1 = async (req, res, next) => {
  try {
    const { fId } = req.query
    const q1 =
      "SELECT f.placement, f.eId, f.fId, afe.eId, afe.role FROM form f LEFT JOIN attendance_form_employees afe ON f.fId = afe.fId WHERE f.fId = ?"
    const q2 =
      "SELECT pgp.pumpGroupNum, pgp.pName, pgp.price FROM form f LEFT JOIN pump_group_price pgp ON f.date = pgp.date WHERE f.fId = ? AND f.placement = pgp.placement"
    const q3 =
      "SELECT pp.pumpNum, pp.pName, pp.end, pp.cal, pp.mgn FROM form f LEFT JOIN pump_product pp ON f.fId = pp.fId WHERE f.fId = ?"
    sql.query(`${q1}; ${q2}; ${q3}`, [fId, fId, fId], function (
      error,
      results,
      fields
    ) {
      if (error) {
        console.log(error)
        res.status(500).send(error)
      }

      // For cashier
      let response = {}
      const cashier = results[0].find((emp) => emp.role === "cashier")
      response.Cashier = cashier.eId
      // For pump attendants
      let pumpAttendants = []
      results[0].forEach((emp) => {
        if (emp.role === "attendant") pumpAttendants.push({ PA: emp.eId })
      })
      response.pumpAttendants = pumpAttendants
      // For pump prices
      let pumpPrices = []
      for (let i = 0; i < 2; i++) {
        let list = results[1]
        if (i === 0) {
          let g1 = {}
          g1.diesel = list[1].price
          g1.accelrate = list[0].price
          g1.jxpremium = list[2].price
          pumpPrices.push(g1)
        } else if (i === 1) {
          let g2 = {}
          g2.diesel = list[4].price
          g2.accelrate = list[3].price
          g2.jxpremium = list[5].price
          pumpPrices.push(g2)
        }
      }
      response.pumpPrices = pumpPrices
      // For end cal mgn
      const list = results[2]
      list.forEach((el) => {
        let pName =
          el.pName === "accelrate"
            ? "Accelrate"
            : el.pName === "diesel"
            ? "Diesel"
            : "JxPremium"
        response[`pump${el.pumpNum}${pName}END`] = el.end
        response[`pump${el.pumpNum}${pName}CAL`] = el.cal
        response[`pump${el.pumpNum}${pName}MGN`] = el.mgn
      })
      res.send(response)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("failed to get group 1")
  }
}
