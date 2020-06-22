const sql = require('./db.js')

const AttendanceForm = function (attendanceForm) {
  const { fId } = attendanceForm
  this.fId = fId
}
AttendanceForm.create = (attendanceForm) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO attendance_form SET ?`, attendanceForm, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}
AttendanceForm.getById = (fId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM attendance_form WHERE fId = '${fId}'`, attendanceForm, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

module.exports = AttendanceForm
