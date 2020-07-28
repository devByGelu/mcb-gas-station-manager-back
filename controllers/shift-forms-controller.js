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
  const employees = await Employee.getAll();
  const expenseCategories = await ExpenseCategory.getAll();
  const customers = await Customer.getAll();
  const products = await Product.getAll();
  const { startDate, endDate } = req.query;
  try {
    const templatePath = "data/dsr-template.xlsx";
    let workbook = new excel.Workbook();
    await workbook.xlsx.readFile(templatePath); // Add template from path
    let sheetToClone = workbook.getWorksheet("template"); // First page of the workbook is the template

    const shiftForms = await ShiftForm.getBetweenDates(startDate, endDate);

    shiftForms.forEach(async (shiftForm, index) => {
      let { date, shift, placement } = shiftForm;

      // Reformat date
      date = dateFormat(new Date(date), "yyyy-m-d");

      // Get formData of shiftForm
      let formData = await ShiftForm.get(date, shift, placement);

      // Append more data for reference
      formData = {
        ...formData,
        expenseCategories,
        customers,
        products,
        employees,
      };

      const sheetName = `${date}-${placement}-${shift}`;

      let sheet = workbook.addWorksheet("Sheet"); // Add worksheet
      sheet.model = sheetToClone.model; // Clone template
      sheet.name = sheetName;

      sheet = ShiftForm.fillBasicInfo(sheet, formData);

      if (index === shiftForms.length - 1) {
        console.log(workbook);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("X-Suggested-Filename", "wa3.xlsx");
        res.attachment('bruh.xlsx')

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    });
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
