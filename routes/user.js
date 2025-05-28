const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verify } = require('../auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/details', verify, userController.getUserDetails);
// router.get('/profile', verify, userController.getProfile);
router.put('/profile', verify, userController.updateProfile);

module.exports = router;
