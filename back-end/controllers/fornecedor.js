const Fornecedor = require('../models/Fornecedor')

const controller = {} // Objeto vazio

controller.novo = async (req, res) => {
   try {
      await Fornecedor.create(req.body)
      // HTTP status 201: Created (criado)
      res.sendStatus(201)
   }
   catch(erro) {
      // HTTP status 500: Internal Server Error
      console.log(erro)
      res.status(500).send(erro)
   }
}

module.exports = controller