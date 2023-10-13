const express = require('express');
const users = require('../controllers/users.controller');

const router = express.Router();

router.route('/getUserDetails/:id').get(users.findOne);
router.route('/getAllUsers').get(users.findAll);
router.route('/updateUser/:id').put(users.update);
router.route('/signin').post(users.signin);
router.route('/signup').post(users.create);
router.route('/deleteUser/:id').post(users.delete);

module.exports = router;