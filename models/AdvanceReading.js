const sql = require('./db.js')
const AdvanceReading = function (advanceReading) {
  const {
    pumpNum,
    pumpGroupNum,
    pName,
    fId,
    placement,
    date,
    advance_reading_form_fId,
    reading,
  } = advanceReading
  this.pumpNum = pumpNum
  this.pumpGroupNum = pumpGroupNum
  this.pName = pName
  this.fId = fId
  this.placement = placement
  this.date = date
  this.advance_reading_form_fId = advance_reading_form_fId
  this.reading = reading
}
AdvanceReading.create = (advanceReading) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO advance_reading SET ?`, advanceReading, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}
module.exports = AdvanceReading
