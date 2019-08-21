const express = require('express');
const router = express.Router();

const workHoursController = require('../app/api/controllers/workHours');
const authentication = require('../auth/auth');

router.post('/create-work-hours/:AgentId', authentication.authenticateUser, workHoursController.create);
router.get('/get-work-hours/:AgentId', authentication.authenticateUser, workHoursController.getByAgentId);
router.put('/delete-work-hours/:WorkHoursId', authentication.authenticateUser, workHoursController.updateDayToWorkHours);
router.post('/create-work-hours', authentication.authenticateUser, workHoursController.create);
router.get('/get-work-hours', authentication.authenticateUser, workHoursController.getByAgentId);

module.exports = router;