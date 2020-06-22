const sql = require('./db.js')

const AttendanceFormEmployee = function (attendanceFormEmployee) {
  const { fId, eId, role } = attendanceFormEmployee
  this.fId = fId
  this.eId = eId
  this.role = role
}
AttendanceFormEmployee.create = (attendanceFormEmployee) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `INSERT INTO attendance_form_employees SET ?`,
      attendanceFormEmployee,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  })
}
module.exports = AttendanceFormEmployee
