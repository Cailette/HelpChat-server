const express = require('express');
const router = express.Router();

const chatsController = require('../api/controllers/chats');
const authorizate = require('../buisnessLogic/auth/authorizate');

router.get('/agent', authorizate.authorizate, chatsController.getVisitorAgent);
router.get('/agent/:VisitorId', authorizate.authorizate, chatsController.getVisitorAgent);
router.get('/', authorizate.authorizate, chatsController.getActiveByAgentId);
router.get('/archive', authorizate.authorizate, chatsController.getInactive);
router.get('/:ChatId', authorizate.authorizate, chatsController.getById);

router.put('/disactiveChat', authorizate.authorizate, chatsController.disactiveChat);
router.put('/rating/:ChatId', authorizate.authorizate, chatsController.rating);

router.delete('/:ChatId', authorizate.authorizate, chatsController.delete);

module.exports = router;