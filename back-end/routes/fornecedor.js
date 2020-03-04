const express = require('express');
const router = express.Router();

const controller = require('../controllers/fornecedor')

router.post('/', controller.novo)

module.exports = router