const sql = require('./db.js')

const PumpGroupPrice = function (pumpGroupPrice) {
  const { pumpGroupNum, pName, placement, date, price } = pumpGroupPrice
  this.pumpGroupNum = pumpGroupNum,
  this.pName = pName,
  this.placement = placement,
  this.date = date,
  this.price = price
}
PumpGroupPrice.create = (pumpGroupPrice) => {
    return new Promise((resolve, reject) => {
      sql.query(`INSERT INTO pump_group_price SET ?`, pumpGroupPrice, (err, res) =>
        err ? reject(err) : resolve(res)
      )
    })
  }
  
  module.exports = PumpGroupPrice