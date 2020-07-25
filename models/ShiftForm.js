const sql = require("./db.js");

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
      "SELECT * FROM `shift_form` WHERE MONTH(date) = ? AND YEAR(date) = ? ORDER BY `shift_form`.`date` DESC, `shift_form`.`placement` ASC",
      [month, year],
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};
ShiftForm.download = async (startDate,endDate,type) => {
  
}
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
      "SELECT * FROM `shift_form` WHERE date = ? ORDER BY `date` DESC, `placement` ASC",
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
    console.log(error);
  }
};

// Getting shift form data
ShiftForm.get = async (date, shift, placement) => {
  let fId = null;
  // Getting fId
  let currShiftForm = await myQuery(
    `SELECT * FROM shift_form WHERE date = ? AND shift = ? AND placement = ?`,
    [date, shift, placement]
  );
  if (!currShiftForm.length) {
    // User is trying to create a new form
    console.log("Creating shiftForm");
    let lastShiftForm = await myQuery(
      `SELECT * FROM shift_form WHERE date = ? AND shift = ? AND placement = ?`,
      [date, shift, parseInt(placement) - 1]
    );
    const pumpInfosQuery = `SELECT * FROM pump_info WHERE fId = ?`;
    // First check if the opened form has a basis for beg values
    // If not
    // Base beg from the earliest shift form placed
    // Getting form of earliest placement
    if (!lastShiftForm.length) {
      return new Promise(async (resolve, reject) => {
        let shiftForms = await myQuery(
          "SELECT * FROM `shift_form` ORDER BY `shift_form`.`date` ASC, `shift_form`.`placement` ASC",
          []
        );
        let lastShiftForm = shiftForms[shiftForms.length - 1];
        // Returning the overall latest placement
        sql.query(pumpInfosQuery, [lastShiftForm.fId], (err, res) => {
          return err ? reject(err) : resolve({ res, shiftFormNotFound: true });
        });
      });
    } else
      return new Promise((resolve, reject) => {
        sql.query(pumpInfosQuery, [lastShiftForm[0].fId], async (err, res) => {
          return err ? reject(err) : resolve({ res, shiftFormNotFound: true });
        });
      });
    // Return placement - 1's beginning
  } else {
    // If user is tring to open an exisiting form
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
    return new Promise((resolve, reject) => {
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
      if (lastShiftForm)
        sql.query(
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
          ],
          (err, res) => (err ? reject(err) : resolve(res))
        );

      sql.query(
        `${shiftEmployeesQuery}; ${pumpGroupPricesQuery}; ${pumpInfosQuery}; ${dropFormQuery}; ${lastDropBreakDownQuery}; ${expensesQuery}; ${creditSalesQuery}; ${cashAdvancesQuery}; ${dipstickQuery}`,
        [fId, fId, fId, fId, fId, fId, fId, fId, fId],
        (err, res) => (err ? reject(err) : resolve(res))
      );
    });
  }
};

module.exports = ShiftForm;
