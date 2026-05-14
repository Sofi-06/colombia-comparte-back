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

router.get(
  '/public/:countrySlug/:testimonialSlug',
  testimonialController.getPublicTestimonialDetail
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

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.getTestimonialById
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

router.patch(
  '/:id/estado',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.changeTestimonialStatus
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  testimonialController.deleteTestimonial
);

module.exports = router;