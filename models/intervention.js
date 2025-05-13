const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var interventionSchemas = mongoose.Schema({
    clientName: { type: String,required:true},
    groupName: { type: String,default:"INDEPENDANT",required:true},
    location:{type:String,required:true},
    ville:{type:String,required:true},
    codePostal:{type:String,required:true},
    state:{type:String,default:"En cours"},
    materials:{type:Array,default:[]},
    modifiedMaterials:{type:Array,default:[]},
    contractNumber:{type:String,default:"XXXXXX"},
    startingDate:{type:String,require:true},
    endingDate:{type:String,require:false}
    })
    interventionSchemas.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("intervention",interventionSchemas)