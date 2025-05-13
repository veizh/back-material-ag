const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var transferSchemas = mongoose.Schema({
    sender: { type: Object,required:true},
    recipient: { type: Object,required:true},
    materials:{type:Array,default:[]},
    date:{type:Date,default:getDateNow()}
    })
    transferSchemas.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("transfer",transferSchemas)
function getDateNow(){
    let date = new Date().toJSON();
    let currentDate = new Date().toJSON().slice(0, 10);
console.log(currentDate);
return currentDate
}