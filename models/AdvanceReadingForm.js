const sql = require('./db.js')
const AdvanceReadingForm = function (advanceReadingForm) {
  const { fId } = advanceReadingForm
  this.fId = fId
}
AdvanceReadingForm.create = (advanceReadingForm) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `INSERT INTO advance_reading_form SET ?`,
      advanceReadingForm,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  })
}
module.exports = AdvanceReadingForm
