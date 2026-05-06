const newsRepository = require('../repositories/newsRepository');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const normalizeNewsPayload = (payload) => {
  return {
    titulo: payload.titulo ?? payload.title,
    resumen: payload.resumen ?? payload.summary,
    contenido: payload.contenido ?? payload.content,
    imagen_principal_url:
      payload.imagen_principal_url ?? payload.image_url ?? payload.imageUrl,
    estado: payload.estado ?? payload.status,
    pais_id: payload.pais_id ?? payload.country_id,
  };
};

const getNews = async (user) => {
  if (user.rol === 'superadmin') {
    return await newsRepository.findAllNews();
  }

  return await newsRepository.findNewsByCountry(user.pais_id);
};

const getPublicNewsByCountry = async (countrySlug) => {
  if (!countrySlug) {
    throw new Error('El país es obligatorio');
  }

  return await newsRepository.findPublishedNewsByCountrySlug(countrySlug);
};

const getPublicNewsDetail = async (countrySlug, newsSlug) => {
  if (!countrySlug || !newsSlug) {
    throw new Error('El país y el slug de la noticia son obligatorios');
  }

  const news = await newsRepository.findPublishedNewsDetailByCountryAndSlug(
    countrySlug,
    newsSlug
  );

  if (!news) {
    throw new Error('Noticia no encontrada');
  }

  return news;
};

const getNewsDetail = async (id, user) => {
  const news = await newsRepository.findNewsById(id);

  if (!news) {
    throw new Error('La noticia no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(news.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para ver esta noticia');
  }

  return news;
};

const createNews = async (payload, user) => {
  const {
    titulo,
    resumen,
    contenido,
    imagen_principal_url,
    estado = 'borrador',
    pais_id,
  } = normalizeNewsPayload(payload);

  if (!titulo || !resumen || !contenido) {
    throw new Error('Título, resumen y contenido son obligatorios');
  }

  let finalPaisId = pais_id;

  if (user.rol !== 'superadmin') {
    finalPaisId = user.pais_id;
  }

  if (!finalPaisId) {
    throw new Error('El país es obligatorio para crear una noticia');
  }

  const finalEstado = estado || 'borrador';

  const fecha_publicacion =
    finalEstado === 'publicado' ? new Date().toISOString() : null;

  const slug = generateSlug(titulo);

  return await newsRepository.createNews({
    pais_id: finalPaisId,
    titulo,
    slug,
    resumen,
    contenido,
    imagen_principal_url: imagen_principal_url || null,
    autor_id: user.id,
    estado: finalEstado,
    fecha_publicacion,
  });
};

const updateNews = async (id, payload, user) => {
  const existingNews = await newsRepository.findNewsById(id);

  if (!existingNews) {
    throw new Error('La noticia no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingNews.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para modificar esta noticia');
  }

  const allowedFields = [
    'titulo',
    'resumen',
    'contenido',
    'imagen_principal_url',
    'estado',
  ];

  const normalizedPayload = normalizeNewsPayload(payload);

  const updatePayload = {};

  allowedFields.forEach((field) => {
    if (normalizedPayload[field] !== undefined) {
      updatePayload[field] = normalizedPayload[field];
    }
  });

  if (normalizedPayload.titulo) {
    updatePayload.slug = generateSlug(normalizedPayload.titulo);
  }

  if (
    normalizedPayload.estado === 'publicado' &&
    existingNews.estado !== 'publicado'
  ) {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }

  if (normalizedPayload.estado && normalizedPayload.estado !== 'publicado') {
    updatePayload.fecha_publicacion = null;
  }

  updatePayload.updated_at = new Date().toISOString();

  return await newsRepository.updateNews(id, updatePayload);
};

const changeNewsStatus = async (id, payload, user) => {
  const existingNews = await newsRepository.findNewsById(id);

  if (!existingNews) {
    throw new Error('La noticia no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingNews.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para cambiar el estado de esta noticia');
  }

  if (user.rol === 'editor' && payload.estado === 'despublicado') {
    throw new Error('El editor no tiene permisos para despublicar noticias');
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

  if (estado === 'publicado' && existingNews.estado !== 'publicado') {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }

  if (estado !== 'publicado') {
    updatePayload.fecha_publicacion = null;
  }

  return await newsRepository.updateNewsStatus(id, updatePayload);
};

const deleteNews = async (id, user) => {
  const existingNews = await newsRepository.findNewsById(id);

  if (!existingNews) {
    throw new Error('La noticia no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingNews.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para eliminar esta noticia');
  }

  if (user.rol === 'editor') {
    throw new Error('El editor no tiene permisos para eliminar noticias');
  }

  await newsRepository.deleteNews(id);

  return {
    message: 'Noticia eliminada correctamente',
  };
};

module.exports = {
  getNews,
  getPublicNewsByCountry,
  getPublicNewsDetail,
  getNewsDetail,
  createNews,
  updateNews,
  changeNewsStatus,
  deleteNews,
};