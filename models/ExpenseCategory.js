const sql = require("./db.js");

// constructor
const ExpenseCategory = function (cashAdvance) {
  const { eId, fId, amount } = cashAdvance;
  this.eId = eId;
  this.fId = fId;
  this.amount = amount;
};
ExpenseCategory.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM expense_category`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports = ExpenseCategory;
