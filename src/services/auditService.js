const auditRepository = require('../repositories/auditRepository');

const recordAction = async ({
  user,
  action,
  module,
  recordId = null,
  description = null,
  ip = null,
}) => {
  if (!user?.id || !action || !module) {
    return null;
  }

  try {
    return await auditRepository.createAuditLog({
      usuario_id: user.id,
      accion: action,
      modulo: module,
      registro_id: recordId,
      descripcion: description,
      ip,
    });
  } catch (error) {
    console.warn('No se pudo guardar la auditoría:', error.message);
    return null;
  }
};

module.exports = {
  recordAction,
};