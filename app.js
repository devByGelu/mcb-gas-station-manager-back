const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const employeesRoutes = require("./routes/employees");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const expenseCategoriesRoutes = require("./routes/expenseCategories");
const shiftFormsRoutes = require("./routes/shiftForms");
const customersRoutes = require("./routes/customers");
const formsRoutes = require("./routes/forms");
const formRoutes = require("./routes/form");
const app = express();
var cors = require("cors");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({ exposedHeaders: ["Content-Disposition", "X-Suggested-Filename"] })
);
app.use((req, res, next) => {
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/api/employees", employeesRoutes);

app.use("/api/form", formRoutes);

app.use("/api/forms", formsRoutes);

app.use("/api/shiftForms", shiftFormsRoutes);

app.use("/api/expenseCategories", expenseCategoriesRoutes);

app.use("/api/customers", customersRoutes);

app.use("/api/products", productsRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  } else {
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown" });
  }
});

// set port, listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
