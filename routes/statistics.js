const express = require('express');
const router = express.Router();

const statisticsController = require('../api/controllers/statistics');
const authorizate = require('../BuisnessLogic/auth/authorizate');

router.get('/:selected/:filterChatAgent/:filterChatDate', authorizate.authorizate, statisticsController.getStatistics);

module.exports = router;