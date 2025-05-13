var express = require('express');
const transfers= require('../controllers/transfers.js');
const auth = require('../middleware/auth.js');
var router = express.Router();

/* products listing. */
router.post("/create",transfers.create)
router.get('/getAll',transfers.getAll)
router.get('/getOne/:id',transfers.getOne)
//router.put('/transferMaterial',transfers.transfer)
// authorize route to roll

module.exports = router;
