const express = require('express');
const carts = require('../controllers/carts.controller');

const router = express.Router();

router.route('/getCart/:id').get(carts.findOne);
router.route('/addCart').post(carts.add);


module.exports = router;