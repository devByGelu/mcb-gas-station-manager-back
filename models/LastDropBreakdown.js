const sql = require('./db.js')
const LastDropBreakdown = function (lastDropBreakdown) {
  const { denomination, quantity, fId } = lastDropBreakdown
  this.denomination=denomination
  this.quantity=quantity
  this.fId=fId
}
LastDropBreakdown.create = (lastDropBreakdown) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `INSERT INTO last_drop_breakdown SET ?`,
      lastDropBreakdown,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  })
}
module.exports = LastDropBreakdown
