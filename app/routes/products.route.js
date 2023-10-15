const express = require('express');
const products = require('../controllers/products.controller');

const router = express.Router();

router.route('/getAllProducts').get(products.findAll);
router.route('/getProductDetails/:id').get(products.findOne);
router.route('/createProduct').post(products.create);


module.exports = router;