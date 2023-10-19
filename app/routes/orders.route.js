const express = require('express');
const orders = require('../controllers/orders.controller');

const router = express.Router();

router.route('/getOrder/:id').get(orders.findOne);
router.route('/createOrder').post(orders.add);


module.exports = router;