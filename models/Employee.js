const sql = require("./db.js");

// constructor
const Employee = function (employee) {
  const { eId, eLN, eMI, eFN, aId, phoneNumber, ecpId } = employee;
  this.eId = eId;
  this.eLN = eLN;
  this.eMI = eMI;
  this.eFN = eFN;
  this.aId = aId;
  this.phoneNumber = phoneNumber;
  this.ecpId = ecpId;
};

Employee.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM employee`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports = Employee;
