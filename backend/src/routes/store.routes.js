const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { listStores } = require('../controllers/store.controller');

router.get('/', verifyToken, requireRole('NORMAL_USER'), listStores);

module.exports = router;