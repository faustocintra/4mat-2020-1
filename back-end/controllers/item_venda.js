const ItemVenda = require('../models/ItemVenda')
// require() no controller do produto
const produtoController = require('./produto')

const controller = {} // Objeto vazio

controller.novo = async (req, res) => {
   try {
      await ItemVenda.create(req.body)

      const retorno = await movimentarEstoque(req.body.produto, req.body.quantidade)

      if(retorno.status != 500) {
         // HTTP status 201: Created (criado)
         res.status(201).end()
      }
      else {
         res.status(500).send(retorno.result)
      }

   }
   catch (erro) {
      // HTTP status 500: Internal Server Error
      console.log(erro)
      res.status(500).send(erro)
   }
}

controller.listar = async (req, res) => {

   // Se houver query string, desvia para busca personalizada
   if (Object.keys(req.query).length > 0) {
      busca(req, res)
   }
   else {

      try {
         // find() sem parâmetros: retorna todos
         // É necessário ter um populate() para cada campo relacionado
         //const lista = await ItemVenda.find().populate('venda').populate('produto')

         // populate() de segundo nível: vendo os dados do cliente que está
         // dentro da venda que está dentro do item da venda
         const lista = await ItemVenda.find().populate(
            // path: campo a ser populado
            // populate: campo da entidade relacionada que será populado
            // em segundo nível
            { path: 'produto', populate: 'fornecedor' }
         )
         .populate('venda')
         /*
         .populate(
            // path: campo a ser populado
            // select: lista de campos a serem exibidos, separados por espaço
            { path: 'venda', select: 'num_venda data_venda'}
         )
         */
         res.send(lista) // O status HTTP 200 (OK) é implícito
      }
      catch (erro) {
         console.log(erro)
         res.status(500).send(erro)
      }
   }
}

/* filtrarVenda() é uma cópia da parte else do listar(), com um filtro
   no find() para buscar apenas os itens de venda correspondentes a uma
   venda que é passada como parâmetro */
controller.filtrarVenda = async (req, res) => {

   try {
      const vendaId = req.params.id
      const lista = await ItemVenda.find({venda: vendaId})
         .populate(  { path: 'produto', populate: 'fornecedor' })
         .populate('venda')
      
      res.send(lista) // O status HTTP 200 (OK) é implícito
   }
   catch (erro) {
      console.log(erro)
      res.status(500).send(erro)
   }

}

// Função obterUmInterno(): permite buscar apenas um item de venda
// sem fazer uma requisição HTTP
controller.obterUmInterno = async function (id) {
   try {
      const obj = await ItemVenda.findById(id)
      return { status: 200, result: obj }
   }
   catch (erro) {
      console.log(erro)
      return { status: 500, result: erro }
   }
}

// Função obterUm() "normal": pode ser acessada externamente via HTTP, mas
// chama a função obterUmInterno() para evitar repetição de código
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

controller.atualizar = async (req, res) => {
   try {
      const id = req.body._id

      // Busca a versão do item de venda antes de atualizar
      let retorno = await controller.obterUmInterno(id)

      if(retorno.status == 500) {
         res.status(500).send(retorno.result)
         return
      }
      const itemVendaAnt = retorno.result

      const obj = await ItemVenda.findByIdAndUpdate(id, req.body)
      if (obj) { // obj foi encontrado e atualizado 
         
         // Calcula a diferença de quantidades
         let qtdAtual = req.body.quantidade - itemVendaAnt.quantidade

         //console.log('Atual: ', req.body.quantidade)
         //console.log('Anterior: ', itemVendaAnt.quantidade)

         // Só atualiza a quantidade se a diferença entre atual e anterior
         // for diferente de zero
         if(qtdAtual != 0) {
            retorno = await movimentarEstoque(req.body.produto, qtdAtual)

            if(retorno.status == 500) {
               console.log(retorno.result)
               res.status(500).send(retorno.result)
               return
            }

         }

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
      const obj = await ItemVenda.findByIdAndDelete(id)
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
   let atrib = Object.keys(req.query)[0]
   let valor = Object.values(req.query)[0]

   // /i no final da expressão regular significa que a
   // busca será case insensitive
   criterio[atrib] = { $regex: valor, $options: 'i' }
   console.log(criterio)

   try {
      let lista = await ItemVenda.find(criterio)
      res.send(lista)
   }
   catch (erro) {
      console.log(erro)
      res.status(500).send(erro)
   }

}

async function movimentarEstoque(produtoId, qtdVendida) {
   try {
      // Busca o produto
      let retorno = await produtoController.obterUmInterno(produtoId)
      if(retorno.status == 200) {
         const produto = retorno.result
         produto.quantidade -= qtdVendida
         return await produtoController.atualizarInterno(produto._id, produto)
      }
      else return retorno

   }
   catch(erro) {
      return { status: 500, result: erro }
   }
}

module.exports = controller