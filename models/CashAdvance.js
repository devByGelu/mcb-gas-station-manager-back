const sql = require('./db.js')

// constructor
const CashAdvance = function (cashAdvance) {
  const { eId, fId, amount } = cashAdvance
  this.eId = eId
  this.fId = fId
  this.amount = amount
}
CashAdvance.create = (cashAdvance) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO cash_advance SET ?`, cashAdvance, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

module.exports = CashAdvance
