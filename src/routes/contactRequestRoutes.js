const express = require('express');
const router = express.Router();

const contactRequestController = require('../controllers/contactRequestController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/*
  RUTA PÚBLICA
*/

router.post(
  '/public',
  contactRequestController.createPublicRequest
);

/*
  RUTAS ADMINISTRATIVAS
*/

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  contactRequestController.listRequests
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  contactRequestController.getRequestById
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.updateRequest
);

router.put(
  '/:id/status',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.updateRequestStatus
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.deleteRequest
);

module.exports = router;