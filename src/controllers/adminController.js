const adminService = require('../services/adminService');

const getAdminPanel = (req, res) => {
  return res.status(200).json({
    message: 'Acceso permitido al panel administrativo',
    user: req.user,
  });
};

const getDashboard = async (req, res) => {
  try {
    const dashboard = await adminService.getDashboard(req.user);

    return res.status(200).json(dashboard);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminPanel,
  getDashboard,
};