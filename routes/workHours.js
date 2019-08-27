const express = require('express');
const router = express.Router();

const workHoursController = require('../app/api/controllers/workHours');
const authentication = require('../auth/auth');

router.post('/:AgentId', authentication.authenticateUser, workHoursController.create);
router.post('/', authentication.authenticateUser, workHoursController.create);

router.get('/:AgentId', authentication.authenticateUser, workHoursController.getByAgentId);
router.get('/', authentication.authenticateUser, workHoursController.getByAgentId);

router.put('/:WorkHoursId', authentication.authenticateUser, workHoursController.updateDayTo);

module.exports = router;