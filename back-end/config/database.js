const mongoose = require('mongoose')

module.exports = function(uri) {
   mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}