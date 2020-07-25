const sql = require("./db.js");

// constructor
const Product = function (cashAdvance) {
  const { eId, fId, amount } = cashAdvance;
  this.eId = eId;
  this.fId = fId;
  this.amount = amount;
};
Product.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM product`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports = Product;
