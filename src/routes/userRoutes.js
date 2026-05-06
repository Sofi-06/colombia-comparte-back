const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.listUsers
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.createUser
);

router.patch(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.updateUser
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.deleteUser
);

module.exports = router;