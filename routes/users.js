const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users-controller");
const { body } = require("express-validator");
const Employee = require("../models/Employee");

router.post(
  "/",
  [
    body(["uName", "password", "lName", "mInit", "fName", "nickName"])
      .notEmpty()
      .withMessage("Required"),

    body(["lName", "mInit", "fName", "nickName"]).isAlpha(),

    body(["password"]).isLength({ min: 6, max: 12 }),
    body(["lName"]).isLength({ min: 6, max: 20 }),
    body(["fName"]).isLength({ min: 6, max: 20 }),
    body(["mInit"]).isLength({ min: 1, max: 1 }),
    body(["nickName"]).isLength({ min: 2, max: 10 }),

    body(["uName"])
      .custom(async (value) => {
        let existingEmployee = await Employee.findByUname(value);
        existingEmployee = existingEmployee.length;
        if (existingEmployee) return Promise.reject();
      })
      .withMessage("Choose another username"),
  ],
  usersController.registerUser
);
module.exports = router;
