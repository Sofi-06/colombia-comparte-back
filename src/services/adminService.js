const contactRequestRepository = require('../repositories/contactRequestRepository');
const newsRepository = require('../repositories/newsRepository');
const testimonialRepository = require('../repositories/testimonialRepository');

const resolveScope = (user) => {
  if (user.rol === 'superadmin') {
    return {
      tipo: 'global',
      pais_id: null,
    };
  }

  if (!user.pais_id) {
    throw new Error('El usuario no tiene un país asignado');
  }

  return {
    tipo: 'pais',
    pais_id: user.pais_id,
  };
};

const getDashboard = async (user) => {
  const scope = resolveScope(user);

  const requests =
    scope.tipo === 'global'
      ? await contactRequestRepository.findAllRequests()
      : await contactRequestRepository.findRequestsByCountry(scope.pais_id);

  const news =
    scope.tipo === 'global'
      ? await newsRepository.findAllNews()
      : await newsRepository.findNewsByCountry(scope.pais_id);

  const testimonials =
    scope.tipo === 'global'
      ? await testimonialRepository.findAllTestimonials()
      : await testimonialRepository.findTestimonialsByCountry(scope.pais_id);

  const ultimasSolicitudes = requests.slice(0, 5);

  return {
    alcance: {
      rol: user.rol,
      tipo: scope.tipo,
      pais_id: scope.pais_id,
      pais_slug: user.pais_slug || null,
      pais_nombre: user.pais_nombre || null,
    },
    metricas: {
      total_solicitudes: requests.length,
      noticias_publicadas: news.filter((item) => item.estado === 'publicado').length,
      testimonios_activos: testimonials.filter((item) => item.estado === 'publicado').length,
      ultimas_solicitudes: ultimasSolicitudes,
    },
  };
};

module.exports = {
  getDashboard,
};