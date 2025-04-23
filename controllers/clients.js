
const clientSchema = require("../models/client");

const { accesControler } = require('../util/access');
require("dotenv").config();
exports.create = async (req,res)=>{
    const newClient = new clientSchema({...req.body})
   
    newClient.save()
      .then(()=> res.status(200).json({msg:`Un Client vient d'être ajouté`}))
      .catch(err=>res.status(400).json({msg:"ce client existe déjà",err}))
  }

exports.getAllClients= async (req,res)=>{
    const clients = await clientSchema.find();

    return res.status(200).json(clients);
  
}
