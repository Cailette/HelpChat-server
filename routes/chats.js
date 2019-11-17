const express = require('express');
const router = express.Router();

const chatsController = require('../api/controllers/chats');
const authorizate = require('../BuisnessLogic/auth/authorizate');

router.get('/agent', authorizate.authorizate, chatsController.getVisitorAgent);
router.get('/', authorizate.authorizate, chatsController.getActiveByAgentId);
router.get('/archive', authorizate.authorizate, chatsController.getInactive);
router.get('/:ChatId', authorizate.authorizate, chatsController.getById);
router.put('/:ChatId', authorizate.authorizate, chatsController.updateById);
router.put('/rating/:ChatId', authorizate.authorizate, chatsController.rating);
router.delete('/:ChatId', authorizate.authorizate, chatsController.delete);
router.get('/agent/:VisitorId', authorizate.authorizate, chatsController.getAgentByVisitorId);

module.exports = router;