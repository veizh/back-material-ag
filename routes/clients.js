var express = require('express');
const clients= require('../controllers/clients');
const auth = require('../middleware/auth');
var router = express.Router();

/* products listing. */
router.post("/create",clients.create)
router.get('/getAllClients',auth,clients.getAllClients)
// authorize route to roll

module.exports = router;
