const express = require('express');
const router = express.Router();

const userController = require('../api/controllers/users');
const authorizate = require('../BuisnessLogic/auth/authorizate');
const authenticate = require('../BuisnessLogic/auth/authenticate');

router.post('/register', userController.create);
// router.post('/authenticate', authenticate.authenticate);
router.post('/registerAgent', authorizate.authorizate, userController.create);

router.get('/user', authorizate.authorizate, userController.getById);
router.get('/:AgentId', authorizate.authorizate, userController.getById);
router.get('/', authorizate.authorizate, userController.getAll);

router.put('/activity', authorizate.authorizate, userController.updateActivity);
router.put('/user', authorizate.authorizate, userController.updateById);
router.put('/:AgentId', authorizate.authorizate, userController.updateById);

// router.delete('/user', authorizate.authorizate, userController.delete);
router.delete('/:AgentId', authorizate.authorizate, userController.delete);

router.get('/working-agent', authorizate.authorizate, userController.getRandomWorkingAgent);

module.exports = router;