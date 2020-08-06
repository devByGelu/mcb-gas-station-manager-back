const sql = require("./db.js");
const excel = require("exceljs");
const fs = require("fs");
const dateFormat = require("dateformat");
const Employee = require("./Employee.js");
const ExpenseCategory = require("./ExpenseCategory.js");
const Customer = require("./Customer.js");
const Product = require("./Product.js");
const ShiftForm = function (shiftForm) {
  const {
    form,
    shiftEmployees,
    pumpGroupPrices,
    pumpInfos,
    dipstickReadings,
    dropForm,
    lastDropBreakDown,
    cashAdvances = [],
    expenses = [],
    creditSales = [],
  } = shiftForm;
  this.form = form;
  this.shiftEmployees = shiftEmployees;
  this.pumpGroupPrices = pumpGroupPrices;
  this.pumpInfos = pumpInfos;
  this.dipstickReadings = dipstickReadings;
  this.dropForm = dropForm;
  this.lastDropBreakDown = lastDropBreakDown;
  this.cashAdvances = cashAdvances;
  this.expenses = expenses;
  this.creditSales = creditSales;
};
const myQuery = (query, params) =>
  new Promise((resolve, reject) => {
    sql.query(query, params, (err, res) => (err ? reject(err) : resolve(res)));
  });
ShiftForm.getByMonth = (year, month) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "SELECT * FROM `shift_form` WHERE MONTH(date) = ? AND YEAR(date) = ? ORDER BY `shift_form`.`date` DESC, `shift_form`.`shift` ASC, `shift_form`.`placement` ASC",
      [month, year],
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};

ShiftForm.getBetweenDates = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "SELECT * FROM shift_form WHERE date >= ?  AND date <= ? ORDER BY `shift_form`.`date` DESC, `shift_form`.`shift` ASC, `shift_form`.`placement` ASC",
      [startDate, endDate],
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};

ShiftForm.fillSummary = async (workbook, shiftForms) => {
  let data = [];

  let sheet = workbook.sheet("Summary");
  let { date, shift, placement } = shiftForms[0];
  date = dateFormat(new Date(date), "yyyy-mm-dd");

  let firstSheetName = `${date}-${shift}-${placement}`;

  let initialSalesFormula = `=SUM('${firstSheetName}'!L6,'${firstSheetName}'!L18)`;
  let initialCreditSalesFormula = `='${firstSheetName}'!K53`;
  let initialWithdrawalsFormula = `='${firstSheetName}'!E53`;
  let initialPurchasesFormula = `='${firstSheetName}'!P53`;
  let initialDieselLSoldFormula = `='${firstSheetName}'!B32`;
  let initialDieselSalesFormula = `='${firstSheetName}'!C32`;
  let initialJxpremiumLSoldFormula = `='${firstSheetName}'!B33`;
  let initialJxpremiumSalesFormula = `='${firstSheetName}'!C33`;
  let initialAccelrateLSoldFormula = `='${firstSheetName}'!B34`;
  let initialAccelrateSalesFormula = `='${firstSheetName}'!C34`;
  let initialIncomeFormula = `='${firstSheetName}'!D35`;

  let salesFormula = initialSalesFormula;
  let creditSalesFormula = initialCreditSalesFormula;
  let withdrawalsFormula = initialWithdrawalsFormula;
  let purchasesFormula = initialPurchasesFormula;
  let dieselLSoldFormula = initialDieselLSoldFormula;
  let dieselSalesFormula = initialDieselSalesFormula;
  let jxpremiumLSoldFormula = initialJxpremiumLSoldFormula;
  let jxpremiumSalesFormula = initialJxpremiumSalesFormula;
  let accelrateLSoldFormula = initialAccelrateLSoldFormula;
  let accelrateSalesFormula = initialAccelrateSalesFormula;
  let incomeFormula = initialIncomeFormula;

  function writeData(prevDate) {
    data.push([
      prevDate,
      salesFormula,
      creditSalesFormula,
      withdrawalsFormula,
      purchasesFormula,
      ,
      ,
      dieselLSoldFormula,
      dieselSalesFormula,
      jxpremiumLSoldFormula,
      jxpremiumSalesFormula,
      accelrateLSoldFormula,
      accelrateSalesFormula,
      incomeFormula,
    ]);
  }
  for (let i = 1; i < shiftForms.length; i++) {
    let prevDate = dateFormat(new Date(shiftForms[i - 1].date), "yyyy-mm-dd");
    let currDate = dateFormat(new Date(shiftForms[i].date), "yyyy-mm-dd");

    let sheetName = `${currDate}-${shiftForms[i].shift}-${shiftForms[i].placement}`;

    if (prevDate === currDate) {
      salesFormula = `${salesFormula} + SUM('${sheetName}'!L6,'${sheetName}'!L18)`;
      creditSalesFormula = `${creditSalesFormula} + '${sheetName}'!K53`;
      withdrawalsFormula = `${withdrawalsFormula} + '${sheetName}'!E53`;
      purchasesFormula = `${purchasesFormula} + '${sheetName}'!P53`;
      dieselLSoldFormula = `${dieselLSoldFormula} + '${sheetName}'!B32`;
      dieselSalesFormula = `${dieselSalesFormula} + '${sheetName}'!C32`;
      jxpremiumLSoldFormula = `${jxpremiumLSoldFormula} + '${sheetName}'!B33`;
      jxpremiumSalesFormula = `${jxpremiumSalesFormula} + '${sheetName}'!C33`;
      accelrateLSoldFormula = `${accelrateLSoldFormula} + '${sheetName}'!B34`;
      accelrateSalesFormula = `${accelrateSalesFormula} + '${sheetName}'!C34`;
      incomeFormula = `${incomeFormula} + '${sheetName}'!D35`;
      if (i === shiftForms.length - 1) writeData(prevDate);
    } else {
      writeData(prevDate);
      salesFormula = `=SUM('${sheetName}'!L6,'${sheetName}'!L18)`;
      creditSalesFormula = `='${sheetName}'!K53`;
      withdrawalsFormula = `='${sheetName}'!E53`;
      purchasesFormula = `='${sheetName}'!P53`;
      dieselLSoldFormula = `='${sheetName}'!B32`;
      dieselSalesFormula = `='${sheetName}'!C32`;
      jxpremiumLSoldFormula = `='${sheetName}'!B33`;
      jxpremiumSalesFormula = `='${sheetName}'!C33`;
      accelrateLSoldFormula = `='${sheetName}'!B34`;
      accelrateSalesFormula = `='${sheetName}'!C34`;
      incomeFormula = `='${sheetName}'!D35`;
    }
  }

  sheet.cell("A3").value(data);

  return workbook;
};
ShiftForm.fillDSR = async (workbook, formData) => {
  function getBreakdowndata(breakdown) {
    let data = [];
    Object.keys(breakdown).forEach((key, index) => {
      if (index > 0) data.push([breakdown[key]]);
    });
    return data;
  }
  function getDipstickData(product) {
    return [
      `${product.openingLevel}-${product.openingLiters}`,
      `${product.closingLevel}-${product.closingLiters}`,
    ];
  }
  function getPumpInfoData(pumpInfo, num) {
    let order = [];
    const { diesel, accelrate, jxpremium } = pumpInfo;
    if (num === 1 || num === 3) order = [diesel, accelrate, jxpremium];
    else order = [jxpremium, accelrate, diesel];

    return [
      [order[0].advRd, order[0].end, order[0].beg, order[0].cal, order[0].mgn],
      [order[1].advRd, order[1].end, order[1].beg, order[1].cal, order[1].mgn],
      [order[2].advRd, order[2].end, order[2].beg, order[2].cal, order[2].mgn],
    ];
  }
  function getGroupPrices(group) {
    return [group.diesel, group.jxpremium, group.accelrate];
  }
  function getEmployeeNames(empIds) {
    const { employees } = formData;
    let names = "";
    for (let i = 0; i < empIds.length; i++) {
      for (let j = 0; j < employees.length; j++) {
        if (empIds[i] == employees[j].eId) {
          if (i !== 0) {
            names = `${names}, ${employees[j].nickName}`;
          } else names = `${employees[j].nickName}`;
        }
      }
    }
    return names;
  }
  let { shiftDate, shift, placement } = formData;
  let sheetName = `${shiftDate}-${shift}-${placement}`;
  let sheetToClone = workbook.sheet("dsr-template");
  let currentSheet = workbook.cloneSheet(sheetToClone, sheetName);

  let target = null;

  const { cashier, pumpAttendants } = formData;
  target = currentSheet.cell("B1");
  target.value([
    [shiftDate],
    [shift],
    [getEmployeeNames([cashier])],
    [getEmployeeNames(pumpAttendants)],
  ]);

  const { group1, group2 } = formData;
  target = currentSheet.cell("C2");
  target.value([getGroupPrices(group1), getGroupPrices(group2)]);

  const { pump1, pump2, pump3, pump4 } = formData;
  target = currentSheet.cell("B8");
  target.value(getPumpInfoData(pump1, 1));
  target = currentSheet.cell("B14");
  target.value(getPumpInfoData(pump2, 2));
  target = currentSheet.cell("B20");
  target.value(getPumpInfoData(pump3, 3));
  target = currentSheet.cell("B26");
  target.value(getPumpInfoData(pump4, 4));

  const { diesel, accelrate, jxpremium } = formData;
  target = currentSheet.cell("E32");
  target.value([
    getDipstickData(diesel),
    getDipstickData(jxpremium),
    getDipstickData(accelrate),
  ]);

  const { drops, amtPerDrop, lastDrop } = formData.dropForm;
  target = currentSheet.cell("B36");
  target.value([[drops], [amtPerDrop], [lastDrop]]);

  target = currentSheet.cell("B44");
  const { breakdown } = formData;
  target.value(getBreakdowndata(breakdown));

  target = currentSheet.cell("D38");
  let { expenses, creditsales, cashadvance } = formData;
  let purchases = expenses.filter(({ catName }) => catName === "Fuel Refill");

  expenses = expenses.filter(({ catName }) => catName !== "Fuel Refill");

  function formatPurchasesData(data) {
    let data1 = [];
    data.forEach((dat) => {
      data1.push([dat.description, dat.total]);
    });
    return data1;
  }
  function formatExpensesData(data) {
    let data1 = [];
    data.forEach((dat) => {
      data1.push([dat.description, dat.total]);
    });
    return data1;
  }
  function formatCashAdvanceData(data) {
    let data1 = [];
    data.forEach((dat) => {
      data1.push([getEmployeeNames([dat.employee]), dat.amt]);
    });
    return data1;
  }
  function formatCreditSalesData(data) {
    let data1 = [];
    data.forEach((dat) => {
      data1.push([
        dat.companyName,
        parseFloat(dat.volume) * parseFloat(dat.discountedPrice),
      ]);
    });
    return data1;
  }
  if (expenses.length) target.value(formatExpensesData(expenses));
  target = currentSheet.cell("G38");
  if (cashadvance.length) target.value(formatCashAdvanceData(cashadvance));
  target = currentSheet.cell("J38");
  if (creditsales.length) target.value(formatCreditSalesData(creditsales));
  target = currentSheet.cell("O38");
  if (purchases.length) target.value(formatPurchasesData(purchases));
  return workbook;
};
ShiftForm.update = async (shiftForm, fId) => {
  // delete
  const tables = [
    "shift_employee",
    "pump_group_price",
    "pump_info",
    "dipstick_reading",
    "drop_form",
    "last_drop_breakdown",
    "cash_advance",
    "expense",
    "credit_sale",
  ];
  tables.forEach(async (tableName) => {
    await myQuery(`DELETE FROM ${tableName} WHERE fId = ?`, [fId]);
    console.log("deleted " + tableName);
  });
  const result = await ShiftForm.create(shiftForm, fId);
  return result;
};
ShiftForm.create = async (shiftForm, shiftFormFId) => {
  let {
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
  } = shiftForm;
  const adjustShiftForms = async () => {
    const { date, placement } = form; // Targets
    // Find form with same placement
    let sameDateForms = await myQuery(
      "SELECT * FROM `shift_form` WHERE date = ? ORDER BY `shift_form`.`date` DESC, `shift_form`.`shift` ASC, `shift_form`.`placement` ASC",
      date
    );
    const samePlacementFormIndex = sameDateForms.findIndex(
      (form) => form.placement == placement
    );
    if (samePlacementFormIndex > 0) {
      // Updating placements
      for (let i = samePlacementFormIndex; i < sameDateForms.length; i++) {
        let { fId, placement } = sameDateForms[i];
        let adjustedPlacement = placement + 1;
        await myQuery("UPDATE shift_form SET ? WHERE fId = ?", [
          { placement: adjustedPlacement },
          fId,
        ]);
      }
    }
    return;
  };
  try {
    let fId = undefined;
    // Defining fId
    if (!shiftFormFId) {
      // If not updating insert shift_form then get its fId

      // If inserting in between existing forms,
      // Adjust the forms
      await adjustShiftForms();
      let insertedShiftForm = await myQuery(
        `INSERT INTO shift_form SET ?`,
        form
      );
      fId = insertedShiftForm.insertId;
    } else fId = shiftFormFId; // If updating, use defined fId
    shiftEmployees.forEach(async (shiftEmployee) => {
      shiftEmployee = { ...shiftEmployee, fId };
      if (shiftEmployee.eId > 0)
        // filter out incomplete fields
        await sql.query(`INSERT INTO shift_employee SET ?`, shiftEmployee);
    });
    pumpGroupPrices.forEach(async (pumpGroupPrice) => {
      pumpGroupPrice = { ...pumpGroupPrice, fId };
      await sql.query(`INSERT INTO pump_group_price SET ?`, pumpGroupPrice);
    });
    pumpInfos.forEach(async (pumpInfo) => {
      pumpInfo = { ...pumpInfo, fId };
      await sql.query(`INSERT INTO pump_info SET ?`, pumpInfo);
    });
    dipstickReadings.forEach(async (dipstickReading) => {
      dipstickReading = { ...dipstickReading, fId };
      await sql.query(`INSERT INTO dipstick_reading SET ?`, dipstickReading);
    });
    dropForm = { ...dropForm, fId };
    await sql.query(`INSERT INTO drop_form SET ?`, dropForm);

    lastDropBreakDown = { ...lastDropBreakDown, fId };
    await sql.query(`INSERT INTO last_drop_breakdown SET ?`, lastDropBreakDown);
    if (cashAdvances.length)
      cashAdvances.forEach(async (cashAdvance) => {
        cashAdvance = { ...cashAdvance, fId };
        await sql.query(`INSERT INTO cash_advance SET ?`, cashAdvance);
      });
    if (expenses.length)
      expenses.forEach(async (expense) => {
        expense = { ...expense, fId };
        await sql.query(`INSERT INTO expense SET ?`, expense);
      });
    if (creditSales.length)
      creditSales.forEach(async (creditSale) => {
        creditSale = { ...creditSale, fId };
        await sql.query(`INSERT INTO credit_sale SET ?`, creditSale);
      });
    return fId;
  } catch (error) {
    return error;
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
      pumpInfo[pName] = { beg };
    });
  }
  return pumpInfo;
};
function getOriginData() {
  return new Promise((resolve, reject) => {
    fs.readFile("data/2020-07-31.json", "utf8", function (err, data) {
      if (err) return reject(err);
      else {
        return resolve(data);
      }
    });
  });
}
function getPumpInfoDefaults() {
  return new Promise((resolve, reject) => {
    fs.readFile("data/pumpInfoDefaults.json", "utf8", function (err, data) {
      if (err) return reject(err);
      else {
        // return resolve(data);
        let parsedData = JSON.parse(data);
        return resolve(parsedData);
      }
    });
  });
}
function extractData(extraData, product, number) {
  let newData = {};
  Object.keys(extraData[`pump${number}`][product]).forEach((key) => {
    newData[key] = {};
    newData[key] = extraData[`pump${number}`][product][key];
  });
  return newData;
}
function updatePumpInfo(pumpInfo, extraData, number) {
  const data = {};
  const products = ["diesel", "accelrate", "jxpremium"];
  products.forEach((product) => {
    data[product] = {};
    data[product] = {
      ...pumpInfo[product],
      ...extractData(extraData, product, number),
    };
  });
  return data;
}
async function formatShiftFormResults(result, shiftFormDate, placement, shift) {
  if (!result) {
    const d = new Date(shiftFormDate); // deduct 1 to respect month index
    let data = await getOriginData();
    data = JSON.parse(data);
    let pumpInfoDefaults = await getPumpInfoDefaults();
    let formData = {
      shiftFormNotFound: true,
      shiftDate: dateFormat(d, "yyyy-mm-dd"),
      shift: shift,
      placement,
      pump1: updatePumpInfo(data.pump1, pumpInfoDefaults, 1),
      pump2: updatePumpInfo(data.pump2, pumpInfoDefaults, 2),
      pump3: updatePumpInfo(data.pump3, pumpInfoDefaults, 3),
      pump4: updatePumpInfo(data.pump4, pumpInfoDefaults, 4),
      pumpAttendants: [null, null, null],

      expenses: [],
      creditsales: [],
      cashadvance: [],
    };
    // console.log(formData);
    return formData;
  }
  if (result.shiftFormNotFound) {
    const d = new Date(shiftFormDate); // deduct 1 to respect month index
    let formData = {
      shiftFormNotFound: result.shiftFormNotFound,
      shiftDate: dateFormat(d, "yyyy-mm-dd"),
      shift: shift,
      placement,
      pump1: getPumpInfo(1, null, result.res),
      pump2: getPumpInfo(2, null, result.res),
      pump3: getPumpInfo(3, null, result.res),
      pump4: getPumpInfo(4, null, result.res),
      pumpAttendants: [null, null, null],

      expenses: [],
      creditsales: [],
      cashadvance: [],
    };
    // console.log(formData);
    return formData;
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
    // Formatting date
    const d = new Date(shiftFormDate); // deduct 1 to respect month index
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
    };
    // console.log(formData);
    return formData;
  }
}
// Getting shift form data
ShiftForm.get = async (date, shift, placement) => {
  let fId = null;
  // Getting fId
  let currShiftForm = await myQuery(
    `SELECT * FROM shift_form WHERE date = ? AND shift = ? AND placement = ?`,
    [date, shift, placement]
  );

  // User is trying to create a new form
  if (!currShiftForm.length) {
    console.log("Creating shiftForm");
    let lastShiftForm = await myQuery(
      `SELECT * FROM shift_form WHERE date = ? AND shift = ? AND placement = ?`,
      [date, shift, parseInt(placement) - 1]
    );
    const pumpInfosQuery = `SELECT * FROM pump_info WHERE fId = ?`;
    // First check if the opened form has a basis for beg values
    // If not
    // Base beg from the earliest shift form placed within the day or earlier
    // Getting form of earliest placement
    if (!lastShiftForm.length) {
      // return new Promise(async (resolve, reject) => {
      let shiftForms = await myQuery(
        "SELECT * FROM `shift_form` ORDER BY `shift_form`.`date` DESC, `shift_form`.`shift` ASC, `shift_form`.`placement` ASC",
        []
      );
      let lastShiftForm = shiftForms.find((form) => {
        const comparedShiftFormDate = new Date(form.date);
        const toOpenShiftFormDate = new Date(date);
        const comparedShiftFormPlacement = form.placement;
        const toOpenShiftFormPlacement = placement;
        if (toOpenShiftFormDate > comparedShiftFormDate) return true;
        else if (toOpenShiftFormDate.getTime == comparedShiftFormDate.getTime)
          if (
            parseInt(toOpenShiftFormPlacement) >
            parseInt(comparedShiftFormPlacement)
          )
            return true;
      });

      if (!lastShiftForm) {
        // Form has no previous
        return formatShiftFormResults(undefined, date, placement, shift);
      }

      console.log("ws");
      console.log(
        "previous form: ",
        JSON.stringify(dateFormat(new Date(lastShiftForm.date), "yyyy-mm-dd"))
      );
      console.log(
        "additional info: ",
        lastShiftForm.shift,
        "(shift) ",
        lastShiftForm.placement,
        " (placement)"
      );
      // If shiftForm at placement - 1 does not exists,
      // return the overall latest placement where the date is earliest
      // compared to the form
      let result = await myQuery(pumpInfosQuery, [lastShiftForm.fId]);
      return formatShiftFormResults(
        { res: result, shiftFormNotFound: true },
        date,
        placement,
        shift
      );
    } else {
      // If shiftForm at placement - 1 exists,
      let result = await myQuery(pumpInfosQuery, [lastShiftForm[0].fId]);
      return formatShiftFormResults(
        { res: result, shiftFormNotFound: true },
        date,
        placement,
        shift
      );
    }
    // User is trying to open an exisiting form
  } else {
    fId = currShiftForm[0].fId;

    // Get pumpInfos1234s' beg, and dipstick's
    let shiftForms = await myQuery(
      "SELECT * FROM `shift_form` ORDER BY `shift_form`.`date` ASC, `shift_form`.`placement` ASC",
      []
    );
    let currShiftFormIndex = shiftForms.findIndex((sf) => sf.fId == fId);
    let lastShiftFormIndex = currShiftFormIndex - 1;
    let lastShiftForm = shiftForms[lastShiftFormIndex];

    //
    // return new Promise((resolve, reject) => {
    const shiftEmployeesQuery = `SELECT * FROM shift_employee WHERE fId = ?`;
    const pumpGroupPricesQuery = `SELECT * FROM pump_group_price WHERE fId = ?`;
    const pumpInfosQuery = `SELECT * FROM pump_info WHERE fId = ?`;
    const dropFormQuery = `SELECT * FROM drop_form WHERE fId = ?`;
    const lastDropBreakDownQuery = `SELECT * FROM last_drop_breakdown WHERE fId = ?`;
    const expensesQuery = `SELECT * FROM expense WHERE fId = ?`;
    const creditSalesQuery = `SELECT * FROM credit_sale WHERE fId = ?`;
    const cashAdvancesQuery = `SELECT * FROM cash_advance WHERE fId = ?`;
    const dipstickQuery = `SELECT * FROM dipstick_reading WHERE fId = ?`;
    const lastShiftFormDipstickQuery = `SELECT * FROM dipstick_reading WHERE fId = ?`;
    const lastShiftFormPumpInfosQuery = `SELECT * FROM pump_info WHERE fId = ?`;
    // When getting a created form with an existing form at placement - 1
    if (lastShiftForm) {
      let result = await myQuery(
        `${shiftEmployeesQuery}; ${pumpGroupPricesQuery}; ${pumpInfosQuery}; ${dropFormQuery}; ${lastDropBreakDownQuery}; ${expensesQuery}; ${creditSalesQuery}; ${cashAdvancesQuery}; ${dipstickQuery}; ${lastShiftFormDipstickQuery}; ${lastShiftFormPumpInfosQuery}`,
        [
          fId,
          fId,
          fId,
          fId,
          fId,
          fId,
          fId,
          fId,
          fId,
          lastShiftForm.fId,
          lastShiftForm.fId,
        ]
      );
      return formatShiftFormResults(result, date, placement, shift);
    }
    // // This case is when getting the 'origin' form

    // let result = await myQuery(
    //   `${shiftEmployeesQuery}; ${pumpGroupPricesQuery}; ${pumpInfosQuery}; ${dropFormQuery}; ${lastDropBreakDownQuery}; ${expensesQuery}; ${creditSalesQuery}; ${cashAdvancesQuery}; ${dipstickQuery}`,
    //   [fId, fId, fId, fId, fId, fId, fId, fId, fId]
    // );
    // return formatShiftFormResults(result, date, placement, shift);
  }
};

module.exports = ShiftForm;
