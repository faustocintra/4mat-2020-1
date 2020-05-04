const express = require('express');
const router = express.Router();

const controller = require('../controllers/venda')

router.post('/', controller.novo)
router.get('/', controller.listar)
router.get('/:id', controller.obterUm)
router.put('/', controller.atualizar)
router.delete('/', controller.excluir)

module.exports = router