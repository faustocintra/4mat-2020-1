const mongoose = require('mongoose')

// É necessário instalar: yarn add mongoose-sequence
// mongoose está sendo passado como parâmetro para mongoose-sequence
const mongooseSeq = require('mongoose-sequence')(mongoose);

const esquema = mongoose.Schema({
   data_venda: {
      type: Date, // Date armezana data e hora
      required: true,
   },
   forma_pagamento: {
      type: String,
      // DI = dinheiro
      // CH = cheque
      // CC = cartão de crédito
      // CD = cartão de débito
      enum: ['DI', 'CH', 'CC', 'CD'],
      required: true
   },
   data_pagamento: {
      type: Date
   },
   num_venda: {
      type: Number,
      index: { unique: true } // Número da venda não pode se repetir
   },
   cliente: {
      type: mongoose.ObjectId,
      ref: 'Cliente',
      required: true
   }
})

// inc_field: o campo a ser autoincrementado
// start_seq: o número que irá iniciar a contagem. Default: 1
esquema.plugin(mongooseSeq, {inc_field: 'num_venda', start_seq: 1});

/*
   Parâmetros de mongoose.model():
   1º -> o nome do modelo (entidade)
   2º -> a descrição da estrutura (esquema) da entidade
   3º -> o nome da coleção (collection) onde os objetos
      criados a partir do modelo serão armazenados no MongoDB
*/
module.exports = mongoose.model('Venda', esquema, 'vendas')