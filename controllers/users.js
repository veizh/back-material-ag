
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userTrackingAppSchema = require("../models/user");

const { accesControler } = require('../util/access');
require("dotenv").config();
exports.create = async (req,res)=>{
    req.body.password = await bcrypt.hash(req.body.password,10)
    const newUser = new userTrackingAppSchema({...req.body})
    newUser.save()
      .then(()=> res.status(200).json({msg:`Un compte vient d'être ajouté`}))
      .catch(err=>res.status(400).json({msg:"Ce nom de compte existe déjà",err}))
  }
  exports.login= async(req,res)=>{
    const {name,password}=req.body
    console.log(name);
    console.log(password);
    
    if(!name || !password ) return res.status(400).json({err:'Un champ n\'est pas rempli'})
  const user = await userTrackingAppSchema.findOne({name:name})
console.log(user);

     if(!user)return res.status(400).json({err:"Cet identifiant n'existe pas."})

    const matchingPasswords = await bcrypt.compare(password,user.password)
    if(!matchingPasswords)return  res.status(400).json({err:"Le mot de passe est incorrect."})
    let token = createJWT(user._id)
    return res.status(200).json({success:"connecté !",token})
  
} 
    

  function createJWT(id){
    return jwt.sign({id:id.toString()}, process.env.BCRYPT_KEY)
}
exports.verifyJWT = async (req, res) => {
    try {
      console.log("token ? ",req.body);
      const token = req.body.token
      //const token = req.headers.authorization.split(' ')[1];
      const id = jwt.verify(token, process.env.BCRYPT_KEY);
         const user =  await  userTrackingAppSchema.find({_id:id.id})
         if(user){
            return res.status(200).json(user[0])
         }
         else res.status(404).json({msg:'didnt match'})

    } catch (error) {
      // console.log(error);
      return res.status(401).json({ error: 'Auth error!' });
      // if (!CallbackError) return;
      // return CallbackError();
    }
  };
exports.getAllUsers= async (req,res)=>{
    const users = await userTrackingAppSchema.find();

    return res.status(200).json(users);
    return res.status(403).json({ msg: "u dont have acces to this" });
  
}
exports.modifyOneUser=async (req,res)=>{
  let user = await userTrackingAppSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {

    try {
      await userTrackingAppSchema.updateOne(
        { _id: req.body._id },
        { $set: req.body }
      ).then(()=>res.status(200).json({msg:"Le compte a bien ete modifié."}))
      .catch(()=>res.status(404).json({msg:"Le changement n'a pas pu être effectué."}))
    } catch (error) {
        return res.status(404).json({ err: err });
    }
     
  } else {
    return res.status(403).json({ msg: "u dont own the rights" });
  }
}
exports.deleteOne = async (req, res) => {
 
    let deleteUser = await userTrackingAppSchema.deleteOne({ _id: req.params._id});
    return res.status(200).json({msg:"le compte a bien été supprimé."});
  
};