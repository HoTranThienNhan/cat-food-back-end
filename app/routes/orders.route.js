const express = require('express');
const orders = require('../controllers/orders.controller');

const router = express.Router();

router.route('/getOrder/:id').get(orders.find);
router.route('/getOrderDetails/:id').get(orders.findOne);
router.route('/getOrderByStatus/:status').get(orders.findOneByStatus);
router.route('/getAllOrders').get(orders.findAll);
router.route('/createOrder').post(orders.add);
router.route('/updateOrderStatus/:id&:status').post(orders.updateStatus);
router.route('/cancelOrder/:status').post(orders.cancel);


module.exports = router;