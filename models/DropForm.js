const sql = require('./db.js')
const DropForm = function (dropForm) {
  const { fId } = dropForm
  this.fId = fId
}
DropForm.create = (dropForm) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO drop_form SET ?`, dropForm, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}
module.exports = DropForm
