const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getDashboard } = require('../controllers/owner.controller');

router.get('/dashboard', verifyToken, requireRole('STORE_OWNER'), getDashboard);

module.exports = router;