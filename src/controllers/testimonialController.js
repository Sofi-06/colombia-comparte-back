const testimonialService = require('../services/testimonialService');

const listTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialService.getTestimonials(req.user);

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const listPublicTestimonials = async (req, res) => {
  try {
    const { countrySlug } = req.params;

    const testimonials = await testimonialService.getPublicTestimonialsByCountry(countrySlug);

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body, req.user);

    return res.status(201).json({
      message: 'Testimonio creado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialService.updateTestimonial(
      id,
      req.body,
      req.user
    );

    return res.status(200).json({
      message: 'Testimonio actualizado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await testimonialService.deleteTestimonial(id, req.user);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialService.getTestimonialDetail(id, req.user);

    return res.status(200).json(testimonial);
  } catch (error) {
    if (error.message.includes('permisos')) {
      return res.status(403).json({
        message: error.message,
      });
    }

    return res.status(404).json({
      message: error.message,
    });
  }
};

const getPublicTestimonialDetail = async (req, res) => {
  try {
    const { countrySlug, testimonialSlug } = req.params;

    const testimonial = await testimonialService.getPublicTestimonialDetail(countrySlug, testimonialSlug);

    return res.status(200).json(testimonial);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const changeTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialService.changeTestimonialStatus(id, req.body, req.user);

    return res.status(200).json({
      message: 'Estado del testimonio actualizado correctamente',
      data: testimonial,
    });
  } catch (error) {
    const statusCode =
      error.message.includes('permisos') ? 403 :
      error.message.includes('Estado no válido') || error.message.includes('obligatorio') ? 400 :
      400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};
module.exports = {
  listTestimonials,
  listPublicTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialById,
  getPublicTestimonialDetail,
  changeTestimonialStatus,
};