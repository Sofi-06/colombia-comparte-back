const getAdminPanel = (req, res) => {
  return res.status(200).json({
    message: 'Acceso permitido al panel administrativo',
    user: req.user,
  });
};

module.exports = {
  getAdminPanel,
};