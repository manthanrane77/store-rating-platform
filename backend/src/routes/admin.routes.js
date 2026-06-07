const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  getDashboardStats, createUser, listUsers,
  getUserDetail, listStores, createStore
} = require('../controllers/admin.controller');

router.use(verifyToken, requireRole('ADMIN'));

router.get('/stats', getDashboardStats);
router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);
router.get('/stores', listStores);
router.post('/stores', createStore);

module.exports = router;