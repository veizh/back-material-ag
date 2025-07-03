
const interventionSchema = require("../models/intervention.js");
const clientsSchema = require("../models/client.js");
const transfersSchema = require('../models/transfers.js')
const { accesControler } = require('../util/access');
const { ObjectId } = require('mongodb');
const { createClient } = require("./clients.js");
require("dotenv").config();
exports.create = async (req, res) => {
  try {
    const { clientData, intervention } = req.body;

    // Vérifier si le client existe
    let client = await clientsSchema.findOne(clientData);

    if (client) {
      console.log("Client déjà enregistré.");
    } else {
      console.log("Client non trouvé, création en cours...");
      client = new clientsSchema(clientData);
      await client.save();
    }

    // Créer l'intervention avec le client lié
    const newIntervention = new interventionSchema({
      ...intervention,
      clientId: client._id, // important : lier l'intervention au client
    });

    await newIntervention.save();

    return res.status(200).json({ msg: "Une intervention a été ajoutée." });

  } catch (err) {
    console.error("Erreur :", err);
    return res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};
exports.getAllInterventions = async (req, res) => {
  const interventions = await interventionSchema.find();

  return res.status(200).json(interventions);
}

exports.getOne = async (req, res) => {
  try {

    const intervention = await interventionSchema.findById(req.params.id)

    if (intervention) return res.status(200).json(intervention);
    return res.status(400).json({ err: "error", msg: "l'ID ne correspond pas" })
  } catch (error) {
    return res.status(500).json({err:"We got a problem "})
  }

}
exports.updateIntervention = async (req, res) => {
  try {
    let data = req.body
    delete data._id
    const intervention = await interventionSchema.findByIdAndUpdate(req.params.id, data, {
      new: true,           // retourne le document modifié
      runValidators: true, // applique les validations du schema
    })
    if (!intervention) {
      return res.status(404).json({ msg: "Intervention non trouvé." });
    }
    res.status(200).json({
      msg: "intervention mise à jour avec succès.",
      intervention: intervention,
    });
  } catch (error) {
    console.error("Erreur de mise à jour :", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }

}
exports.getAllTransfer= async(req,res)=>{
 try {
    // Récupérer l'intervention par son ID
    let intervention = await interventionSchema.findById(req.params.id);

    // Chercher les transferts liés à l'ID du sender
    const transfers = await transfersSchema.find({"sender.0._id": ObjectId(req.params.id)});
    
    // Tableau pour tous les matériaux transférés
    let allMaterialsTransfered = [];

    // Fonction pour mettre à jour la quantité de matériaux dans le tableau
    function updateMaterials(arr, newMaterial) {
      // Cherche si un matériau avec la même référence existe déjà dans le tableau
      const existingMaterial = arr.find(item => item.ref === newMaterial.ref);

      if (existingMaterial) {
        // Si le matériau existe déjà, on incrémente la quantité
        existingMaterial.quantity = (parseInt(existingMaterial.quantity) + parseInt(newMaterial.quantity)).toString();
      } else {
        // Sinon, on ajoute le nouveau matériau au tableau
        arr.push(newMaterial);
      }
    }

    // Traitement des transferts de matériaux
    transfers.forEach(e => {
      e.materials.forEach(item => {
        updateMaterials(allMaterialsTransfered, item);
      });
    });

    // Traitement des matériaux de l'intervention
    intervention.materials.forEach(e => {
      updateMaterials(allMaterialsTransfered, e);
    });

    // Mise à jour des matériaux de l'intervention
    intervention.materials = allMaterialsTransfered;
    intervention.state = "Terminé";
    intervention.endingDate=req.body.endingDate
    let returned = req.body.materialsReturned
    // Sauvegarde de l'intervention mise à jour
    const updatedIntervention = await intervention.save();
    returned.map(async (e)=>{
   await fetch("https://stock-ag-back.vercel.app/products/returnFromInter/"+e._id,{
       method: "PUT",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(e)
    })
})
    // Retourner l'intervention mise à jour
    res.status(200).json(updatedIntervention);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des matériaux', error });
  }

return res.status(200).json()




}
exports.transfer = async (req, res,next) => {
  let siteA = req.body.siteA
  let siteB = req.body.siteB
  let idA  = req.body.siteA._id
  let idB  = req.body.siteB._id
  delete siteA._id
  delete siteB._id
  req.body.materialsSelected.map((x) => {
    req.body.siteA.materials.map((e, i) => {

      if (e.ref === x.ref) {
        siteA.materials[i].quantity = parseInt(e.quantity) - parseInt(x.quantity)
        if (siteA.materials[i].quantity < 1) {
          siteA.materials.splice(i, 1);
        }
      }
    })

    const indexB = siteB.materials.findIndex((e) => e.ref === x.ref);

    if (indexB!== -1) {
      // Si le matériel existe déjà, on additionne les quantités
      siteB.materials[indexB].quantity = parseInt(siteB.materials[indexB].quantity) + parseInt(x.quantity);
    } else {
      // Sinon, on ajoute le nouveau matériel
      siteB.materials.push(x);
    }
  })
  try {
  const newSiteA = await interventionSchema.findByIdAndUpdate(idA, siteA, {
    new: true,           // retourne le document modifié
    runValidators: true, // applique les validations du schema
  })
  const newSiteB = await interventionSchema.findByIdAndUpdate(idB, siteB, {
    new: true,           // retourne le document modifié
    runValidators: true, // applique les validations du schema
  })
  if (!newSiteB) {
    return res.status(404).json({ msg: "Intervention non trouvé." });
  }
  if (!newSiteA) {
    return res.status(404).json({ msg: "Intervention non trouvé." });
  }
    next()
  
  }
  catch (error) {
    console.error("Erreur de mise à jour :", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }


}
exports.deleteOne = async (req, res) => {
    let deleteUser = await interventionSchema.deleteOne({ _id: req.params._id});
    return res.status(200).json({msg:"le compte a bien été supprimé."});
 
};