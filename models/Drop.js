const sql = require('./db.js')
const Drop = function (drop) {
  const { fId, numOfDrops, amtPerDrop, lastDrop } = drop
  this.fId = fId
  this.numOfDrops=numOfDrops
  this.amtPerDrop=amtPerDrop
  this.lastDrop=lastDrop
}
Drop.create = (drop) => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO `drop` SET ?", drop, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}
module.exports = Drop
