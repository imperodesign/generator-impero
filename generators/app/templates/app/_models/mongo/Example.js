const mongoose = require('mongoose')

const exampleSchema = mongoose.Schema({
  exampleKey: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Example', exampleSchema)
