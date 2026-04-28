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

module.exports = {
  listTestimonials,
  listPublicTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};