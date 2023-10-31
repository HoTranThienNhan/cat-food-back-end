const express = require('express');
const orders = require('../controllers/orders.controller');

const router = express.Router();

router.route('/getOrder/:id').get(orders.find);
router.route('/createOrder').post(orders.add);
router.route('/updateOrderStatus/:id&:status').post(orders.updateStatus);


module.exports = router;