const testimonialRepository = require('../repositories/testimonialRepository');

const getTestimonials = async (user) => {
  if (user.rol === 'superadmin') {
    return await testimonialRepository.findAllTestimonials();
  }

  return await testimonialRepository.findTestimonialsByCountry(user.pais_id);
};

const getPublicTestimonialsByCountry = async (countrySlug) => {
  if (!countrySlug) {
    throw new Error('El país es obligatorio');
  }

  return await testimonialRepository.findPublishedTestimonialsByCountrySlug(countrySlug);
};

const createTestimonial = async (payload, user) => {
  const {
    nombre,
    cargo,
    empresa,
    contenido,
    foto_url,
    instagram_url,
    facebook_url,
    estado = 'borrador',
    destacado = false,
    pais_id,
  } = payload;

  if (!nombre || !contenido || !foto_url) {
    throw new Error('Nombre, contenido y foto son obligatorios');
  }

  let finalPaisId = pais_id;

  if (user.rol !== 'superadmin') {
    finalPaisId = user.pais_id;
  }

  if (!finalPaisId) {
    throw new Error('El país es obligatorio para crear un testimonio');
  }

  const finalEstado = estado || 'borrador';

  const fecha_publicacion =
    finalEstado === 'publicado' ? new Date().toISOString() : null;

  return await testimonialRepository.createTestimonial({
    pais_id: finalPaisId,
    nombre,
    cargo: cargo || null,
    empresa: empresa || null,
    contenido,
    foto_url,
    instagram_url: instagram_url || null,
    facebook_url: facebook_url || null,
    estado: finalEstado,
    destacado: Boolean(destacado),
    autor_id: user.id,
    fecha_publicacion,
  });
};

const updateTestimonial = async (id, payload, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);

  if (!existingTestimonial) {
    throw new Error('El testimonio no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingTestimonial.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para modificar este testimonio');
  }

  const allowedFields = [
    'pais_id',
    'nombre',
    'cargo',
    'empresa',
    'contenido',
    'foto_url',
    'instagram_url',
    'facebook_url',
    'estado',
    'destacado',
  ];

  const updatePayload = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updatePayload[field] = payload[field];
    }
  });

  if (user.rol !== 'superadmin') {
    delete updatePayload.pais_id;
  }

  if (
    payload.estado === 'publicado' &&
    existingTestimonial.estado !== 'publicado'
  ) {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }

  if (payload.estado && payload.estado !== 'publicado') {
    updatePayload.fecha_publicacion = null;
  }

  updatePayload.updated_at = new Date().toISOString();
  return await testimonialRepository.updateTestimonial(id, updatePayload);
};

const getTestimonialDetail = async (id, user) => {
  const testimonial = await testimonialRepository.findTestimonialById(id);

  if (!testimonial) {
    throw new Error('El testimonio no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(testimonial.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para ver este testimonio');
  }

  return testimonial;
};

const getPublicTestimonialDetail = async (countrySlug, testimonialSlug) => {
  if (!countrySlug || !testimonialSlug) {
    throw new Error('El país y el slug del testimonio son obligatorios');
  }

  const testimonial = await testimonialRepository.findPublishedTestimonialDetailByCountryAndSlug(
    countrySlug,
    testimonialSlug
  );

  if (!testimonial) {
    throw new Error('Testimonio no encontrado');
  }

  return testimonial;
};

const changeTestimonialStatus = async (id, payload, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);

  if (!existingTestimonial) {
    throw new Error('El testimonio no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingTestimonial.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para cambiar el estado de este testimonio');
  }

  if (user.rol === 'editor' && payload.estado === 'despublicado') {
    throw new Error('El editor no tiene permisos para despublicar testimonios');
  }

  const estado = payload.estado ?? payload.status;

  if (!estado) {
    throw new Error('El estado es obligatorio');
  }

  if (!['borrador', 'publicado', 'despublicado'].includes(estado)) {
    throw new Error('Estado no válido');
  }

  const updatePayload = {
    estado,
    updated_at: new Date().toISOString(),
  };

  if (estado === 'publicado' && existingTestimonial.estado !== 'publicado') {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }

  if (estado !== 'publicado') {
    updatePayload.fecha_publicacion = null;
  }

  return await testimonialRepository.updateTestimonialStatus(id, updatePayload);
};

const deleteTestimonial = async (id, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);

  if (!existingTestimonial) {
    throw new Error('El testimonio no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingTestimonial.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para eliminar este testimonio');
  }

  if (user.rol === 'editor') {
    throw new Error('El editor no tiene permisos para eliminar testimonios');
  }

  await testimonialRepository.deleteTestimonial(id);

  return {
    message: 'Testimonio eliminado correctamente',
  };
};

module.exports = {
  getTestimonials,
  getPublicTestimonialsByCountry,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialDetail,
  getPublicTestimonialDetail,
  changeTestimonialStatus,
};
