const express = require('express');
const router = express.Router();

const userController = require('../api/controllers/users');
const authorizate = require('../BuisnessLogic/auth/authorizate');

//musi być na górze (CastError: Cast to ObjectId failed for value "working-now" at path "_id" for model "User")
router.get('/working-now', authorizate.authorizate, userController.getWorkingUsers);
router.get('/working-random', authorizate.authorizate, userController.getRandomWorkingUser);

router.post('/register', userController.create);
router.post('/authenticate', userController.login);
router.post('/registerAgent', authorizate.authorizate, userController.create);

router.get('/user', authorizate.authorizate, userController.getById);
router.get('/:AgentId', authorizate.authorizate, userController.getById);
router.get('/', authorizate.authorizate, userController.getAll);

router.put('/activity', authorizate.authorizate, userController.updateActivity);
router.put('/user', authorizate.authorizate, userController.updateById);
router.put('/:AgentId', authorizate.authorizate, userController.updateById);

// router.delete('/user', authorizate.authorizate, userController.delete);
router.delete('/:AgentId', authorizate.authorizate, userController.delete);

module.exports = router;