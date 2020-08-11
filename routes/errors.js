const { validationResult } = require("express-validator");

function errorFormatter({ location, msg, param, value, nestedErrors }) {
  return `${msg}`;
}
exports.getFormattedErrors = (req) =>
  validationResult(req).formatWith(errorFormatter);
exports.getErrors = (req) => validationResult(req);
