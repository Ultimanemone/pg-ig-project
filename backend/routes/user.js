const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.get('/accounts', userController.getAccount);
router.post('/accounts', userController.createAccount);
router.put('/accounts', userController.editAccount);
router.delete('/accounts', userController.deleteAccount);
router.post('/preferences', userController.updateUserPref);

module.exports = router;
