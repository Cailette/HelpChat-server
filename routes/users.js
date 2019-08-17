const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');
const authentication = require('../auth/auth');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.get('/account-information', authentication.authenticateUser, userController.getById);
router.put('/edit-account-information', authentication.authenticateUser, userController.updateById);
router.put('/switch-activity', authentication.authenticateUser, userController.switchActivity);
router.put('/account-information', authentication.authenticateUser, userController.updateById);
router.delete('/account', authentication.authenticateUser, userController.delete);
router.get('/agents-accounts', authentication.authenticateUser, userController.getAll);
router.post('/create-agent-account/:addAgent', authentication.authenticateUser, userController.create);
router.get('/agent-account-information/:AgentId', authentication.authenticateUser, userController.getById);
router.put('/edit-agent-account/:AgentId', authentication.authenticateUser, userController.updateById);
router.delete('/agent-account/:AgentId', authentication.authenticateUser, userController.delete);

module.exports = router;