const getProfile = (req, res) => {
  return res.status(200).json({
    message: 'Perfil autenticado correctamente',
    user: req.user,
  });
};

module.exports = {
  getProfile,
};