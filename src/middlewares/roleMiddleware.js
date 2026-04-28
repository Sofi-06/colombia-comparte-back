const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.rol;

    if (!userRole) {
      return res.status(403).json({
        message: 'No se pudo identificar el rol del usuario',
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'No tiene permisos para acceder a este recurso',
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};