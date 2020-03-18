const mongoose = require('mongoose')

const esquema = mongoose.Schema({
   descricao: {
      type: String,
      required: true
   },
   preco_compra: {
      type: Number,
      required: true,
      min: 0
   },
   preco_venda: {
      type: Number,
      min: 0
   },
   data_validade: {
      type: Date
   },
   quantidade: {
      type: Number,
      required: true,
      default: 0 // Valor padrão
   },
   unidade_medida: {
      type: String, // unidade, peça, kg, litro, m²...
      required: true
   },
   categoria: {
      type: String,
      required: true,
      default: 'Alimentícios'
   },
   fornecedor: {
      type: mongoose.ObjectId,
      ref: 'Fornecedor', // Nome do model referenciado
      required: true
   }
})

/*
   Parâmetros do método mongoose.model()
   1º -> Nome do modelo
   2º -> Estrutura (esquema) do modelo
   3º -> Nome da coleção (collection) em que os objetos criados a partir do modelo serão armazenados no
      MongoDB
*/
module.exports = mongoose.model('Produto', esquema, 'produtos')