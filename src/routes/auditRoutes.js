const express = require('express');
const router = express.Router();
const { listAudits } = require('../controllers/auditController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// GET /api/audits?limit=20&offset=0
router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), listAudits);

module.exports = router;
