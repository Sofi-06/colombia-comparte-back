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
  getPublicNewsDetail,
  createNews,
  updateNews,
  deleteNews,
};