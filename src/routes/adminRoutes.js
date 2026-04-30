const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const adminController = require('../controllers/adminController');

router.get(
  '/panel',
  verifyToken,
  authorizeRoles('superadmin'),
  adminController.getAdminPanel
);

router.get(
  '/dashboard',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  adminController.getDashboard
);

module.exports = router;