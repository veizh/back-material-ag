const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var userTrackingAppSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role:{type:String,required:true}
    })
    userTrackingAppSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("userTrackingApp",userTrackingAppSchema)