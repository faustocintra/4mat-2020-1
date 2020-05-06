const mongoose = require('mongoose')

const esquema = mongoose.Schema({
   fornecedor: {
      type: mongoose.ObjectId,
      ref: 'Fornecedor',
      required: true
   },
   produto: {
      type: mongoose.ObjectId,
      ref: 'Produto',
      required: true
   }
})

/*
fornecedor        produto
485485834757fc0   9569405543dfs04
485485834757fc0   586586586767de4
5583759495dae65   586586586767de4
5583759495dae65   9569405543dfs04
5583759495dae65   afd0885968ecd99
*/

/*
   Parâmetros de mongoose.model():
   1º -> o nome do modelo (entidade)
   2º -> a descrição da estrutura (esquema) da entidade
   3º -> o nome da coleção (collection) onde os objetos
      criados a partir do modelo serão armazenados no MongoDB
*/
module.exports = mongoose.model('FornecedorProduto', esquema, 'fornecedores-produtos')