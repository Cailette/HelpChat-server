const express = require('express');
const router = express.Router();

const chatsController = require('../api/controllers/chats');
const authorizate = require('../BuisnessLogic/auth/authorizate');

router.get('/', authorizate.authorizate, chatsController.getActiveByAgentId);
router.put('/:ChatId', authorizate.authorizate, chatsController.updateById);

module.exports = router;