const express = require('express');
const router = express.Router();

const visitorsController = require('../controllers/visitors');
const auth = require('../auth/auth');

router.post('/', visitorsController.create);
router.put('/', auth.authorizateVisitor, visitorsController.update);
router.get('/', auth.authorizateUser, visitorsController.getAll);
router.get('/:VisitorId', auth.authorizateUser, visitorsController.getById);
router.get('/visitor', auth.authorizateVisitor, visitorsController.getById);

module.exports = router;