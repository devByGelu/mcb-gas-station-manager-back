const sql = require('./db.js')
const DipstickReadingForm = function (dipstickReadingForm) {
  const { fId } = dipstickReadingForm
  this.fId = fId
}
DipstickReadingForm.create = (dipstickReadingForm) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `INSERT INTO dipstick_reading_form SET ?`,
      dipstickReadingForm,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  })
}
module.exports = DipstickReadingForm
