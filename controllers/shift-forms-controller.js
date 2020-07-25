const sql = require("../models/db");
const dateFormat = require("dateFormat");
const ShiftForm = require("../models/ShiftForm");
const ExpenseCategory = require("../models/ExpenseCategory");
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const Product = require("../models/Product");

exports.getByMonth = async (req, res, next) => {
  const { year, month } = req.params;
  try {
    const result = await ShiftForm.getByMonth(year, month);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
exports.download = async (req, res, next) => {
  const { startDate, endDate, type } = req.query;
  try {
    const result = await ShiftForm.download(start, end, type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
exports.create = async (req, res, next) => {
  try {
    const {
      form,
      shiftEmployees,
      pumpGroupPrices,
      pumpInfos,
      dipstickReadings,
      dropForm,
      lastDropBreakDown,
      cashAdvances,
      expenses,
      creditSales,
    } = req.body;
    const shiftform = new ShiftForm({
      form,
      shiftEmployees,
      pumpGroupPrices,
      pumpInfos,
      dipstickReadings,
      dropForm,
      lastDropBreakDown,
      cashAdvances,
      expenses,
      creditSales,
    });
    const result = await ShiftForm.create(shiftform);
    res.status(200).send({ fId: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};
exports.update = async (req, res, next) => {
  try {
    const { fId } = req.params;
    const {
      form,
      shiftEmployees,
      pumpGroupPrices,
      pumpInfos,
      dipstickReadings,
      dropForm,
      lastDropBreakDown,
      cashAdvances,
      expenses,
      creditSales,
    } = req.body;
    const shiftForm = new ShiftForm({
      form,
      shiftEmployees,
      pumpGroupPrices,
      pumpInfos,
      dipstickReadings,
      dropForm,
      lastDropBreakDown,
      cashAdvances,
      expenses,
      creditSales,
    });
    const result = await ShiftForm.update(shiftForm, fId);
    console.log("successfully updated");
    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};

const getPumpInfo = (num, currentBasis, previousBasis) => {
  let pumpInfo = {};
  // When form is created
  if (currentBasis) {
    if (currentBasis.length)
      currentBasis.forEach((curr) => {
        if (previousBasis)
          // For forms with entries and with previous bases (with end and beg)
          previousBasis.forEach((prev) => {
            if (curr.pName == prev.pName) {
              if (curr.pumpNum == num) {
                const { end, cal, mgn, advance_reading, pName } = curr;
                const beg = prev.end;
                pumpInfo[pName] = {
                  beg,
                  end,
                  cal,
                  mgn,
                  advRd: advance_reading,
                };
              }
            }
          });
        else {
          // Catches case when origin form is opened
          const { end, cal, mgn, advance_reading, pName } = curr;
          pumpInfo[pName] = {
            end,
            cal,
            mgn,
            advRd: advance_reading,
          };
        }
      });
  }
  // When trying to create a form
  else {
    previousBasis.forEach((prev) => {
      const { end, pName } = prev;
      const beg = end;
      pumpInfo[pName] = {
        beg,
      };
    });
  }
  return pumpInfo;
};
exports.get = async (req, res, next) => {
  try {
    const { year, month, day, shift } = req.params;
    const { placement } = req.query;
    const result = await ShiftForm.get(
      `${year}-${month}-${day}`,
      shift,
      placement
    );
    //
    console.log(result);
    if (result.shiftFormNotFound) {
      console.log("heyy");
      console.log(result.res);
      const employees = await Employee.getAll();
      const expenseCategories = await ExpenseCategory.getAll();
      const customers = await Customer.getAll();
      const products = await Product.getAll();
      // Formatting date
      const d = new Date(year, parseInt(month, "10") - 1, day); // deduct 1 to respect month index
      let formData = {
        shiftFormNotFound: result.shiftFormNotFound,
        shiftDate: dateFormat(d, "yyyy-mm-dd"),
        shift: shift,
        placement,
        pump1: getPumpInfo(1, null, result.res),
        pump2: getPumpInfo(2, null, result.res),
        pump3: getPumpInfo(3, null, result.res),
        pump4: getPumpInfo(4, null, result.res),
        employees,
        pumpAttendants: [null, null, null],
        expenseCategories,
        customers,
        products,

        expenses: [],
        creditsales: [],
        cashadvance: [],
      };
      console.log(formData);
      res.status(200).send(formData);
    } else {
      // Formattig results
      // Cashier
      let cashier = result[0].find((employee) => employee.role === "Cashier");
      // PAs
      let pumpAttendants = [];
      result[0].forEach((pa) => {
        if (pa.role === "Pump Attendant") pumpAttendants.push(pa.eId);
      });
      // Group 1 prices
      let group1 = {};
      result[1].forEach((el) => {
        if (el.groupNum === 1) group1[el.pName] = el.price;
      });
      // Group 2 prices
      let group2 = {};
      result[1].forEach((el) => {
        if (el.groupNum === 2) group2[el.pName] = el.price;
      });
      // For dipstick
      const dipstick = {};
      const dipstickFields = [
        "closingLevel",
        "closingLiters",
        "openingLevel",
        "openingLiters",
      ];
      result[8].forEach((current) => {
        const { pName } = current;
        dipstickFields.forEach((field) => {
          dipstick[pName] = {
            ...dipstick[pName],
            [field]: current[field],
          };
        });
      });
      const { diesel = 0, accelrate = 0, jxpremium = 0 } = dipstick;
      //
      const employees = await Employee.getAll();
      const expenseCategories = await ExpenseCategory.getAll();
      const customers = await Customer.getAll();
      const products = await Product.getAll();
      // Formatting date
      const d = new Date(year, parseInt(month, "10") - 1, day); // deduct 1 to respect month index
      let formData = {
        fId: cashier.fId,
        shiftDate: dateFormat(d, "yyyy-mm-dd"),
        shift: shift,
        placement,
        cashier: cashier.eId,
        pumpAttendants,
        group1,
        group2,
        pump1: getPumpInfo(1, result[2], result[10]),
        pump2: getPumpInfo(2, result[2], result[10]),
        pump3: getPumpInfo(3, result[2], result[10]),
        pump4: getPumpInfo(4, result[2], result[10]),
        dropForm: {
          drops: result[3][0].drops,
          amtPerDrop: result[3][0].amtPerDrop,
          lastDrop: result[3][0].lastDrop,
        },
        breakdown: result[4][0],
        expenses: result[5],
        creditsales: result[6],
        cashadvance: result[7].map((el) => {
          return { employee: el.eId, amt: el.amount };
        }),
        diesel,
        accelrate,
        jxpremium,
        employees,
        expenseCategories,
        customers,
        products,
      };
      console.log(formData);
      res.status(200).send(formData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};
