const sql = require('./db.js')

const PumpLitersForm = function (pumpLitersForm) {
  const { fId, date } = pumpLitersForm

  this.fId = fId

  this.date = date
}
PumpLitersForm.create = (pumpLitersForm) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `INSERT INTO pump_liters_form SET ?`,
      pumpLitersForm,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  })
}

module.exports = PumpLitersForm
