const sql = require('./db.js')

// constructor
const CreditSale = function (creditSale) {
  const { customer, amount, date, fId } = creditSale
  this.customer = customer
  this.amount = amount
  this.date = date
  this.fId = fId
}
CreditSale.create = (creditSale) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO credit_sale SET ?`, creditSale, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

module.exports = CreditSale
