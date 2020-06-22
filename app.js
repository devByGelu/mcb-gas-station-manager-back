const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require('./models/http-error')
const employeesRoutes = require('./routes/employees')
const formsRoutes = require('./routes/forms')
const formRoutes = require('./routes/form')
const app = express()
var cors = require('cors')

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use((req, res, next) => {
    
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
  })
  
  app.use('/api/employees', employeesRoutes)

  app.use('/api/form', formRoutes)
  
  app.use('/api/forms', formsRoutes)


  // app.use((req, res, next) => {
  //   const error = new HttpError('Could not find route.', 404)
  //   throw error
  // })
  
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error)
    } else {
      res.status(error.code || 500) // 500 someth went wrong
      res.json({ message: error.message || 'An unknown' })
    }
  })

// set port, listen for requests
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
