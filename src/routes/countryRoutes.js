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

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.getCountry
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.createCountry
);

router.patch(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.updateCountry
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.deleteCountry
);

module.exports = router;