/** Express app for jobly. */

const express = require("express");
const ExpressError = require("./helpers/expressError");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const app = express();
const { SECRET_KEY } = require('./config');

app.use(express.json());

// add logging system
app.use(morgan("tiny"));

// routes
const companyRoutes = require('./routes/companies');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
app.use('/companies',companyRoutes);
app.use('/jobs',jobRoutes);
app.use('/users',userRoutes);

// POST /login
// should authenticate user and return a JSON Web Token
// containing payload with username and is_admin values
app.post('/gimmetoken', (req,res,next)=>{
  try{
    let { username } = req.body;
    let token = jwt.sign({username}, SECRET_KEY);
    return res.json({token});
  }
  catch (err) {
    return next(err);
  }
})

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
