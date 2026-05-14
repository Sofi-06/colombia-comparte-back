const metricsService = require('../services/metricsService');

const getMetrics = async (req, res) => {
  try {
    const user = req.user;
    const metrics = await metricsService.getMetricsForUser(user);

    return res.status(200).json({ message: 'Métricas obtenidas', data: metrics });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMetrics,
};
