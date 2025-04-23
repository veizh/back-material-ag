const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var clientSchema = mongoose.Schema({
    clientName: { type: String, required: true },
    groupName: { type: String, required: true, default:"INDEPENDANT" },
    location:{type: String, required: true},
    codePostal:{type: String, required: true},
    ville:{type: String, required: true}
    })
    clientSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("clients",clientSchema)