const sql = require('./db.js')

const Pump = function (pump) {
  const { pumpNum, pumpGroupNum } = pump
  this.pumpNum = pumpNum
  this.pumpGroupNum = pumpGroupNum
}
// On which pump group does pump belong
Pump.getGroup = (pumpNumber) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `SELECT pumpGroupNum FROM pump WHERE pumpNum = '${pumpNumber}'`,
      (err, res) => (err ? reject(err) : resolve(res[0].pumpGroupNum))
    )
  })
}

module.exports = Pump
