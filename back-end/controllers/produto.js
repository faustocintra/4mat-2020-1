const Produto = require('../models/Produto')

const controller = {} // Objeto vazio

controller.novo = async (req, res) => {
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

controller.listar = async (req, res) => {
   
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
      catch {
         console.log(erro)
         res.status(500).send(erro)
      }
   }

}

controller.obterUm = async (req, res) => {

   try {
      const id = req.params.id
      const obj = await Produto.findById(id)
      if (obj) { // obj foi encontrado
         res.send(obj) // HTTP 200 implícito
      }
      else {
         // HTTP 404: Not found
         res.status(404).end()
      }
   }
   catch (erro) {
      console.log(erro)
      res.status(500).send(erro)
   }
}

controller.atualizar = async (req, res) => {
   try {
      const id = req.body._id
      const obj = await Produto.findByIdAndUpdate(id, req.body)
      if (obj) { // obj encontrado e atualizado
         // HTTP 204: No content
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

controller.excluir = async (req, res) => {
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

controller.movimentarEstoque = function (produto_id, quantidade) {
   // 1) Busca do produto pelo Id (obterUm)
   // 2) Alteração na quantidade (quantidadeProd - quantVendida)
   // 3) Salva o produto
}

module.exports = controller