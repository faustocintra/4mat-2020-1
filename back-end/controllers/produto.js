const Produto = require('../models/Produto')

const controller = {} // Objeto vazio

controller.novo = async function (req, res) {
   try {
      await Produto.create(req.body)
      // HTTP Status 201: Created
      res.status(201).end()
   }
   catch (erro) {
      console.log(erro)
      // HTTP 500: Internal Server Error
      res.status(500).send(erro)
   }
}

controller.listar = async function (req, res) {
   
   if(Object.keys(req.query).length > 0) { // Se houver query string
      busca(req, res)
   }
   else { // sem query string
      try {
         // find(), sem parâmetros, retorna todos
         // O parâmetro de populate() é o *ATRIBUTO* relacionado
         const lista = await Produto.find().populate('fornecedor')
         res.send(lista) // HTTP 200 implícito
      }
      catch (erro) {
         console.log(erro)
         res.status(500).send(erro)
      }
   }

}

controller.obterUmInterno = async function (id) {
   try {
      const obj = await Produto.findById(id)
      return { status: 200, result: obj }
   }
   catch (erro) {
      console.log(erro)
      return { status: 500, result: erro }
   }
}

controller.obterUm = async function (req, res) {

   const id = req.params.id
   let retorno = await controller.obterUmInterno(id)

   if(retorno.status == 200) {
      if(retorno.result) res.send(retorno.result) // HTTP 200 implícito
      else res.status(404).end() // HTTP 404
   }
   else {
      res.status(500).send(retorno.result)
   }
   
}

// atualizarInterno(): para uso interno do back-end sem necessidade de 
// realizar uma chamada HTTP
controller.atualizarInterno = async function (id, body) {
   try {
      const obj = await Produto.findByIdAndUpdate(id, body)
      if (obj) { // obj encontrado e atualizado
         // HTTP 204: No content
         return { status: 204, result: undefined }
      }
      else {
         return { status: 404, result: undefined }
      }
   }
   catch (erro) {
      console.log(erro)
      return { status: 500, result: erro }
   }
}

controller.atualizar = async function (req, res) {
   const id = req.body._id
   const retorno = await controller.atualizarInterno(id, req.body)
   if (retorno.status == 500) {
      res.status(500).send(retorno.result)
   }
   else {
      res.status(retorno.status).end()
   }
}

controller.excluir = async function (req, res) {
   try {
      const id = req.body._id
      const obj = await Produto.findByIdAndDelete(id)
      if (obj) {
         res.status(204).end()
      }
      else {
         res.status(404).end()
      }
   }
   catch (erro) {
      console.log(erro)
      res.status(500).send(erro)
   }
}

async function busca(req, res) {
   let criterio = {}
  
   const atrib = Object.keys(req.query)[0]
   const valor = Object.values(req.query)[0]
   
   // $options: 'i' => case insensitive
   criterio[atrib] = { $regex: valor, $options: 'i'}

   console.log('Critério:')
   console.log(criterio)

   try {
      const lista = await Produto.find(criterio)
      res.send(lista)
   }
   catch(erro) {
      console.log(erro)
      res.status(500).send(erro)
   }
}

module.exports = controller