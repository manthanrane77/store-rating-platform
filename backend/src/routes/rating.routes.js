const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { submitRating, updateRating } = require('../controllers/rating.controller');

router.post('/', verifyToken, requireRole('NORMAL_USER'), submitRating);
router.patch('/:id', verifyToken, requireRole('NORMAL_USER'), updateRating);

module.exports = router;