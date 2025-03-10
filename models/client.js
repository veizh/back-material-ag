const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var clientSchema = mongoose.Schema({
    clientName: { type: String, required: true },
    contractNumber: { type: String, unique: true, required: false },
    groupName: { type: String, required: false },
    })
    clientSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("clients",clientSchema)