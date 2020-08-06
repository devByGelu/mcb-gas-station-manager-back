const sql = require("./db.js");

// constructor
const Employee = function (employee) {
  const { lName, mInit, fName, nickName, uName } = employee;
  this.lName = lName;
  this.mInit = mInit;
  this.fName = fName;
  this.nickName = nickName;
  this.uName = uName;
};

Employee.create = (employee) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO employee SET ?`, [employee], (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};
Employee.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM employee`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports = Employee;
