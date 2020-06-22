const sql = require('./db.js')

// constructor
const ExpenseForm = function (expenseForm) {
  const { fId } = expenseForm
  this.fId = fId
}
ExpenseForm.create = (expenseForm) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO expense_form SET ?`, expenseForm, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

module.exports = ExpenseForm
