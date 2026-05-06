const newsService = require('../services/newsService');

const listNews = async (req, res) => {
  try {
    const news = await newsService.getNews(req.user);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const listPublicNews = async (req, res) => {
  try {
    const { countrySlug } = req.params;

    const news = await newsService.getPublicNewsByCountry(countrySlug);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await newsService.getNewsDetail(id, req.user);

    return res.status(200).json(news);
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

const getPublicNewsDetail = async (req, res) => {
  try {
    const { countrySlug, newsSlug } = req.params;

    const news = await newsService.getPublicNewsDetail(countrySlug, newsSlug);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const createNews = async (req, res) => {
  try {
    const news = await newsService.createNews(req.body, req.user);

    return res.status(201).json({
      message: 'Noticia creada correctamente',
      data: news,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await newsService.updateNews(id, req.body, req.user);

    return res.status(200).json({
      message: 'Noticia actualizada correctamente',
      data: news,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const changeNewsStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await newsService.changeNewsStatus(id, req.body, req.user);

    return res.status(200).json({
      message: 'Estado de la noticia actualizado correctamente',
      data: news,
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

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await newsService.deleteNews(id, req.user);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listNews,
  listPublicNews,
  getNewsById,
  getPublicNewsDetail,
  createNews,
  updateNews,
  changeNewsStatus,
  deleteNews,
};