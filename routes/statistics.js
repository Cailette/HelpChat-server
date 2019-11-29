const express = require('express');
const router = express.Router();

const statisticsController = require('../api/controllers/statistics');
const authorizate = require('../buisnessLogic/auth/authorizate');

router.get('/chats/:selected/:filterChatAgent/:filterChatDate', 
    authorizate.authorizate, statisticsController.getChatsStatistics);
router.get('/agents/:selected/:filterChatAgent/:filterChatDate', 
    authorizate.authorizate, statisticsController.getAgentsStatistics);

module.exports = router;