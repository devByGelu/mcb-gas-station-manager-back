const sql = require('./db.js')

// constructor
const Form = function (form) {
  const { eId, placement, date, shift } = form
  this.eId = eId
  this.placement = placement
  this.date = date
  this.shift = shift
}
Form.create = (form) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO form SET ?`, form, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}
Form.findByMonth = (month,year) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM form WHERE MONTH(date) = ${month} AND YEAR(date)=${year}`, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

module.exports = Form
