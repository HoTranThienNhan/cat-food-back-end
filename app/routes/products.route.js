const express = require('express');
const products = require('../controllers/products.controller');

const router = express.Router();

router.route('/getAllProducts').get(products.findAll);
router.route('/getProductsByType/:id').get(products.findByType);
router.route('/searchProductsByName/:name').get(products.searchByName);
router.route('/getProductDetails/:id').get(products.findOne);
router.route('/createProduct').post(products.create);
router.route('/updateProduct/:id').post(products.update);
router.route('/deleteProduct/:id').post(products.delete);

module.exports = router;