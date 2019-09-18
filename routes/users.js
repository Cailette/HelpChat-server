const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');
const auth = require('../auth/auth');

router.post('/register', userController.create);
router.post('/authenticate', auth.authenticate);
router.post('/registerAgent', auth.authorizateUser, userController.create);

router.get('/user', auth.authorizateUser, userController.getById);
router.get('/:AgentId', auth.authorizateUser, userController.getById);
router.get('/', auth.authorizateUser, userController.getAll);

router.put('/activity', auth.authorizateUser, userController.updateActivity);
router.put('/user', auth.authorizateUser, userController.updateById);
router.put('/:AgentId', auth.authorizateUser, userController.updateById);

router.delete('/user', auth.authorizateUser, userController.delete);
router.delete('/:AgentId', auth.authorizateUser, userController.delete);

router.get('/working-agent', auth.authorizateVisitor, userController.getRandomWorkingAgent);

module.exports = router;