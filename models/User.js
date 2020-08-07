const sql = require("./db.js");

// constructor
const User = function (user) {
  const { uName, password } = user;
  this.uName = uName;
  this.password = password;
};

User.find = (uName) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM user WHERE uName = ?`, [uName], (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};
User.create = (user) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO user SET ?`, [user], (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

User.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM user`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports = User;
