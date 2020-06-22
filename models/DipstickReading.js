


const sql = require('./db.js')
const DipstickReading = function (dipstickReading) {
  const { pName, fId, openingLevel, openingLiters, closingLevel, closingLiters } = dipstickReading
  this.pName=pName
  this.fId=fId
  this.openingLevel=openingLevel
  this.openingLiters=openingLiters
  this.closingLevel=closingLevel
  this.closingLiters=closingLiters
}
DipstickReading.create = (dipstickReading) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `INSERT INTO dipstick_reading SET ?`,
      dipstickReading,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  })
}
module.exports = DipstickReading
