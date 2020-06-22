const sql = require('./db.js')

// constructor
const Expense = function (expense) {
  const { fId,description,amount } = expense
  this.fId = fId
  this.description=description
  this.amount=amount
}
Expense.create = (expense) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO expense SET ?`, expense, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

module.exports = Expense
