const router = require('express').Router()
const Accounts = require('./accounts-model');
const { checkAccountPayload, checkAccountNameUnique, checkAccountId, } = require('./accounts-middleware');

router.get('/', (req, res, next) => {
  Accounts.getAll()
    .then(accountsList => {
        res.json(accountsList)
    })
    .catch(next);
})

router.get('/:id', checkAccountId, (req, res) => {
  res.json(req.account);
})

router.post('/', checkAccountPayload, checkAccountNameUnique, (req, res, next) => {
  const newAccount = {name: req.body.name.trim(), budget: req.body.budget, };
  Accounts.create(newAccount)
    .then(insertedAccount => {
      res.status(201).json(insertedAccount);
    })
    .catch(next);
})

router.put('/:id', checkAccountPayload, checkAccountNameUnique, checkAccountId, (req, res, next) => {
  const accountId = req.params.id;
  const updatedInfo = req.body;
  Accounts.updateById(accountId, updatedInfo)
    .then(updatedAccount => {
      res.json(updatedAccount)
    })
    .catch(next);
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  const accountId = req.params.id;
  Accounts.deleteById(accountId)
    .then(deletedAccount => {
      res.json(deletedAccount);
    })
    .catch(next);
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    custom: `Something is wrong`,
    message: err.message,
    stack: err.stack,
  }); 
})

module.exports = router;
