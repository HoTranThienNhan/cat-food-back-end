const express = require('express');
const users = require('../controllers/users.controller');

const router = express.Router();

router.route('/getUserDetails/:id').get(users.findOne);
router.route('/getUserDetailsByEmail/:id').get(users.findOneByEmail);
router.route('/getAllUsers').get(users.findAll);
router.route('/updateUser/:id').put(users.update);
router.route('/signin').post(users.signin);
router.route('/signup').post(users.create);
router.route('/deleteUser/:id').post(users.delete);
router.route('/addFavorite/:userId&:productId').put(users.addFavorite);
router.route('/removeFavorite/:userId&:productId').put(users.removeFavorite);

// admin routes
router.route('/signinAdmin').post(users.signinAdmin);

module.exports = router;