const express = require('express');
const router = express.Router();

const countryController = require('../controllers/countryController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.listCountries
);

router.get(
  '/active',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  countryController.listActiveCountries
);

module.exports = router;