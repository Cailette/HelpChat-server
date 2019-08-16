const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');
const authentication = require('../auth/auth');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.get('/account-information', authentication.authenticateUser, userController.getById);
router.put('/edit-account-information', authentication.authenticateUser, userController.updateById);
router.put('/switch-activity', authentication.authenticateUser, userController.switchActivity);

module.exports = router;