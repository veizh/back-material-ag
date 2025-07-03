const transferSchema = require('../models/transfers')
const interventionSchema = require('../models/intervention')
exports.create = async (req, res) => {
  try {
    let recipient = await interventionSchema.find({contractNumber:req.body.siteB.contractNumber})
    let sender = await interventionSchema.find({contractNumber:req.body.siteA.contractNumber})
    let data = {
        recipient:recipient,
        sender:sender,
        materials:req.body.materialsSelected
        
    }

  // Créer l'intervention avec le client lié
  const newTransfer = new transferSchema({
    ...data // important : lier l'intervention au client
  });

  await newTransfer.save();

  return res.status(200).json({ msg: "Un transfert a été ajoutée:"+ data });

  } catch (err) {
    return res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};
exports.getAll= async(req,res)=>{
    try{
         const transfers = await transferSchema.find();
        
          return res.status(200).json(transfers);
        
    }catch(error){
        
        res.status(400).json({msg:"Il y'a un problème"})
    }
}
exports.getOne = async (req, res) => {
  try {

    const transferTicket = await transferSchema.findById(req.params.id)

    if (transferTicket) return res.status(200).json(transferTicket);
    return res.status(400).json({ err: "error", msg: "l'ID ne correspond pas" })
  } catch (error) {
    return res.status(500).json({err:"We got a problem "})
  }

}
exports.deleteOne = async (req, res) => {
    let deleteUser = await transferSchema.deleteOne({ _id: req.params._id});
    return res.status(200).json({msg:"le compte a bien été supprimé."});
 
};