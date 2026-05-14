const express = require('express');
const multer = require('multer');

const archivoController = require('../controllers/archivoController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  archivoController.listFiles
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  archivoController.getFileById
);

router.post(
  '/upload',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  upload.single('archivo'),
  archivoController.uploadFile
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  archivoController.deleteFile
);

module.exports = router;