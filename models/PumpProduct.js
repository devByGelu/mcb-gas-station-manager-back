const sql = require('./db.js')

const PumpProduct = function (pumpProduct) {
  const {pumpNum, pumpGroupNum, pName, fId, placement, date, end, cal, mgn} = pumpProduct
  this.pumpNum = pumpNum
  this.pumpGroupNum = pumpGroupNum
  this.pName = pName
  this.fId = fId
  this.placement=placement
  this.date=date
  this.end=end
  this.cal=cal
  this.mgn=mgn
}
PumpProduct.create = (pumpProduct) => {
    return new Promise((resolve, reject) => {
      sql.query(`INSERT INTO pump_product SET ?`, pumpProduct, (err, res) =>
        err ? reject(err) : resolve(res)
      )
    })
  }
PumpProduct.getByfId = (fId) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT FROM pump_product WHERE fId = '${fId}'`, pumpProduct, (err, res) =>
        err ? reject(err) : resolve(res)
      )
    })
  }

module.exports = PumpProduct
