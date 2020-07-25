const sql = require("./db.js");

// constructor
const Customer = function (cashAdvance) {
  const { eId, fId, amount } = cashAdvance;
  this.eId = eId;
  this.fId = fId;
  this.amount = amount;
};
Customer.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM customer`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports = Customer;
