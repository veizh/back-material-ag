var express = require('express');
const interventions= require('../controllers/interventions.js');
const transfers= require('../controllers/transfers.js');
const auth = require('../middleware/auth');
var router = express.Router();

/* products listing. */
router.post("/create",interventions.create)
router.get('/getAllInterventions',interventions.getAllInterventions)
router.get('/getOne/:id',interventions.getOne)
router.put('/updateIntervention/:id',interventions.updateIntervention)
router.put('/transferMaterial',interventions.transfer,transfers.create)
// authorize route to roll

module.exports = router;
