const Account = require('./accounts-model');
const db = require("../../data/db-config");

exports.checkAccountPayload = (req, res, next) => {
  const error = { status: 400}
  const account = req.body;
  if (account.name === undefined || account.budget === undefined) {
    error.message = "name and budget are required";
    next(error)
  } else if (typeof account.name !== "string") {
    error.message = "name of account must be a string";
    next(error)
  } else if (account.name.trim().length < 3 || account.name.trim().length > 100) {
    error.message = "name of account must be between 3 and 100";
    next(error)
  } else if (typeof account.budget !== "number" || isNaN(account.budget)) {
    error.message = "budget of account must be a number";
    next(error)
  } else if (account.budget < 0 || account.budget > 1000000) {
    error.message = "budget of account is too large or too small";
    next(error)
  }

  if (error.message) {
    next(error)
  } else {
    next()
  }
}

exports.checkAccountNameUnique = (req, res, next) => {
  const account = req.body;
  db('accounts').where('name', account.name.trim()).first()
    .then(exists => {
      if(exists) {
        next({ status: 400, message: "that name is taken"})
      } else {
        next();
      }
    })
    .catch(next);
}

exports.checkAccountId = (req, res, next) => {
  const accountId = req.params.id;
  Account.getById(accountId)
    .then(account => {
      if(account) {
        req.account = account
        next()
      } else {
        res.status(404).json({ message: "account not found" })
      }
    })
    .catch(next)
}
