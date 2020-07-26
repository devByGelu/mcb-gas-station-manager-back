const sql = require("../models/db");
const excel = require("exceljs");
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
  const { startDate, endDate } = req.query;
  try {
    // const result = await ShiftForm.download(startDate, endDate);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 25 },
      { header: "Published", key: "published", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(tutorials);

    // res is a Stream object
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
    // res.status(200).json(result);
  } catch (error) {
    console.log(error);
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

exports.get = async (req, res, next) => {
  try {
    const { year, month, day, shift } = req.params;
    const { placement } = req.query;
    const result = await ShiftForm.get(
      `${year}-${month}-${day}`,
      shift,
      placement
    );

    const employees = await Employee.getAll();
    const expenseCategories = await ExpenseCategory.getAll();
    const customers = await Customer.getAll();
    const products = await Product.getAll();

    // append form options
    const formData = {
      ...result,
      expenseCategories,
      customers,
      products,
      employees,
    };
    res.status(200).send(formData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};
