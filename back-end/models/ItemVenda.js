// @ts-nocheck
const mongoose = require('mongoose')

const esquema = mongoose.Schema({
   quantidade: {
      type: Number,
      required: true,
      validate: {
         // Função de validação: a quantidade deve
         // ser maior que zero para ser válido
         validator: function(val) {
            return val > 0
         },
         message: 'A quantidade deve ser maior que zero'
      }
   },
   desconto: {
      type: Number,
      required: true,
      default: 0, // Se não for informado, assume 0
      min: 0
   },
   acrescimo: {
      type: Number,
      required: true,
      default: 0,
      min: 0
   },
   venda: {
      type: mongoose.ObjectId,
      ref: 'Venda',
      required: true
   },
   produto: {
      type: mongoose.ObjectId,
      ref: 'Produto',
      required: true
   }
})

/*
   Parâmetros de mongoose.model():
   1º -> o nome do modelo (entidade)
   2º -> a descrição da estrutura (esquema) da entidade
   3º -> o nome da coleção (collection) onde os objetos
      criados a partir do modelo serão armazenados no MongoDB
*/
module.exports = mongoose.model('ItemVenda', esquema, 'itens_venda')