const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.send('this is the cupcakes page')
})

module.exports = router
