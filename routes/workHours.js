const express = require('express');
const router = express.Router();

const workHoursController = require('../api/controllers/workHours');
const authorizate = require('../BuisnessLogic/auth/authorizate');

router.post('/:AgentId', authorizate.authorizate, workHoursController.create);

router.get('/:AgentId', authorizate.authorizate, workHoursController.getByAgentId);

router.put('/:WorkHoursId', authorizate.authorizate, workHoursController.updateDayTo);

module.exports = router;