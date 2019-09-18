const express = require('express');
const router = express.Router();

const workHoursController = require('../controllers/workHours');
const auth = require('../auth/auth');

router.post('/:AgentId', auth.authorizateUser, workHoursController.create);
router.post('/', auth.authorizateUser, workHoursController.create);

router.get('/:AgentId', auth.authorizateUser, workHoursController.getByAgentId);
router.get('/', auth.authorizateUser, workHoursController.getByAgentId);

router.put('/:WorkHoursId', auth.authorizateUser, workHoursController.updateDayTo);

module.exports = router;