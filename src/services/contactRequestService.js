const contactRequestRepository = require('../repositories/contactRequestRepository');

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const getRequests = async (user) => {
  if (user.rol === 'superadmin') {
    return await contactRequestRepository.findAllRequests();
  }

  return await contactRequestRepository.findRequestsByCountry(user.pais_id);
};

const createPublicRequest = async (payload) => {
  const {
    pais_id,
    nombre,
    correo,
    telefono,
    finalidad,
    mensaje,
  } = payload;

  if (!pais_id || !nombre || !correo || !telefono || !finalidad) {
    throw new Error('País, nombre, correo, teléfono y finalidad son obligatorios');
  }

  if (!isValidEmail(correo)) {
    throw new Error('El correo electrónico no tiene un formato válido');
  }

  return await contactRequestRepository.createRequest({
    pais_id,
    nombre,
    correo,
    telefono,
    finalidad,
    mensaje: mensaje || null,
    estado: 'pendiente',
  });
};

const updateRequestStatus = async (id, payload, user) => {
  const existingRequest = await contactRequestRepository.findRequestById(id);

  if (!existingRequest) {
    throw new Error('La solicitud no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingRequest.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para gestionar esta solicitud');
  }

  const { estado, observaciones_admin } = payload;

  const allowedStates = ['pendiente', 'en_proceso', 'gestionada', 'cerrada'];

  if (!estado || !allowedStates.includes(estado)) {
    throw new Error('Estado no válido');
  }

  const updatePayload = {
    estado,
    observaciones_admin: observaciones_admin || existingRequest.observaciones_admin,
    gestionado_por: user.id,
    updated_at: new Date().toISOString(),
  };

  if (estado === 'gestionada' || estado === 'cerrada') {
    updatePayload.fecha_gestion = new Date().toISOString();
  }

  return await contactRequestRepository.updateRequest(id, updatePayload);
};

const deleteRequest = async (id, user) => {
  const existingRequest = await contactRequestRepository.findRequestById(id);

  if (!existingRequest) {
    throw new Error('La solicitud no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingRequest.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para eliminar esta solicitud');
  }

  if (user.rol === 'editor') {
    throw new Error('El editor no tiene permisos para eliminar solicitudes');
  }

  await contactRequestRepository.deleteRequest(id);

  return {
    message: 'Solicitud eliminada correctamente',
  };
};

module.exports = {
  getRequests,
  createPublicRequest,
  updateRequestStatus,
  deleteRequest,
};