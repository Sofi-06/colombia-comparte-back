const express = require('express');
const router = express.Router();

const testimonialController = require('../controllers/testimonialController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/*
  RUTAS PÚBLICAS
*/

router.get(
  '/public/:countrySlug',
  testimonialController.listPublicTestimonials
);

/*
  RUTAS ADMINISTRATIVAS
*/

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.listTestimonials
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.createTestimonial
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.updateTestimonial
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  testimonialController.deleteTestimonial
);

module.exports = router;