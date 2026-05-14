const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const metricsController = require('../controllers/metricsController');

// Accessible by superadmin, admin_pais and editor roles
router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), metricsController.getMetrics);

module.exports = router;
