const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/password', verifyToken, updatePassword);

module.exports = router;