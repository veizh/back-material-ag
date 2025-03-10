
const interventionSchema = require("../models/intervention.js");

const { accesControler } = require('../util/access');
require("dotenv").config();
exports.create = async (req,res)=>{
  console.log(req.body);
  
    const newIntervention = new interventionSchema({...req.body})
   
    newIntervention.save()
      .then(()=> res.status(200).json({msg:`Une intervention a été ajouté`}))
      .catch(err=>res.status(400).json({msg:"Erreur lors de la création de l'intervention",err}))
  }

exports.getAllInterventions= async (req,res)=>{
    const interventions = await interventionSchema.find();

    return res.status(200).json(interventions);
}

exports.getOne= async (req,res)=>{
  try {
    
    const intervention = await interventionSchema.findById(req.params.id)
    return res.status(200).json(intervention);
  } catch (error) {
    return res.status(400).json({err:"error",msg:"l'ID ne correspond pas"})
  }
 
}
