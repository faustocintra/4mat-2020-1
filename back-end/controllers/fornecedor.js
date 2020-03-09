const Fornecedor = require('../models/Fornecedor')

const controller = {} // Objeto vazio

controller.novo = async (req, res) => {
   try {
      await Fornecedor.create(req.body)
      // HTTP status 201: Created (criado)
      res.status(201).end()
   }
   catch(erro) {
      // HTTP status 500: Internal Server Error
      console.log(erro)
      res.status(500).send(erro)
   }
}

controller.listar = async (req, res) => {
   try {
      // find() sem parâmetros: retorna todos
      const lista = await Fornecedor.find()
      res.send(lista) // O status HTTP 200 (OK) é implícito
   }
   catch(erro) {
      console.log(erro)
      res.status(500).send(erro)
   }
}

controller.obterUm = async (req, res) => {
   try {
      const id = req.params.id
      const obj = await Fornecedor.findById(id)
      if(obj) { // obj foi encontrado
         res.send(obj) // HTTP 200
      }
      else {
         // HTTP 404: Not found
         res.status(404).end()
      }
   }
   catch(erro) {
      console.log(erro)
      res.status(500).send(erro)
   }
}

controller.atualizar = async (req, res) => {
   try {
      const id = req.body._id
      const obj = await Fornecedor.findByIdAndUpdate(id, req.body)
      if(obj) { // obj foi encontrado e atualizado 
         // HTTP 204: No content
         res.status(204).end()
      }
      else {
         res.status(404).end()
      }
   }
   catch(erro) {
      console.log(erro)
      res.status(500).send(erro)
   }
}

module.exports = controller