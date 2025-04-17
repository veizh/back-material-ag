const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var interventionSchemas = mongoose.Schema({
    clientName: { type: String,required:true},
    location:{type:String,required:true},
    State:{type:String,required:false,default:"En cours"},
    materials:{type:Array,default:[]},
    contractNumber:{type:String,default:"XXXXXX"},
    startingDate:{type:String,require:true},
    endDate:{type:String,require:false}
    })
    interventionSchemas.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("intervention",interventionSchemas)