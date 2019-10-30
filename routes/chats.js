const express = require('express');
const router = express.Router();

const chatsController = require('../api/controllers/chats');
const authorizate = require('../BuisnessLogic/auth/authorizate');

router.get('/', authorizate.authorizate, chatsController.getActiveByAgentId);
router.get('/archive', authorizate.authorizate, chatsController.getInactive);
router.put('/:ChatId', authorizate.authorizate, chatsController.updateById);
router.put('/rating/:ChatId', authorizate.authorizate, chatsController.rating);

module.exports = router;