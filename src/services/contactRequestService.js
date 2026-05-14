const contactRequestRepository = require('../repositories/contactRequestRepository');
const auditService = require('./auditService');

const ALLOWED_PURPOSES = ['Servicio', 'Programa EDIFICA', 'Shows y conferencias'];
const ALLOWED_STATES = ['pendiente', 'en_proceso', 'gestionada', 'cerrada'];

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const normalizeRequestPayload = (payload) => {
  return {
    pais_id: payload.pais_id ?? payload.country_id,
    nombre: payload.nombre ?? payload.name,
    correo: payload.correo ?? payload.email,
    telefono: payload.telefono ?? payload.phone,
    finalidad: payload.finalidad ?? payload.purpose,
    mensaje: payload.mensaje ?? payload.message,
    estado: payload.estado ?? payload.status,
    observaciones_admin:
      payload.observaciones_admin ?? payload.admin_notes,
  };
};

const validatePurpose = (finalidad) => {
  if (!ALLOWED_PURPOSES.includes(finalidad)) {
    throw new Error(
      `La finalidad debe ser una de estas opciones: ${ALLOWED_PURPOSES.join(', ')}`
    );
  }
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
  } = normalizeRequestPayload(payload);

  if (!pais_id || !nombre || !correo || !telefono || !finalidad) {
    throw new Error('PaÃ­s, nombre, correo, telÃ©fono y finalidad son obligatorios');
  }

  if (!isValidEmail(correo)) {
    throw new Error('El correo electrÃ³nico no tiene un formato vÃ¡lido');
  }

  validatePurpose(finalidad);

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

const getRequestById = async (id, user) => {
  const existingRequest = await contactRequestRepository.findRequestDetailById(id);

  if (!existingRequest) {
    throw new Error('La solicitud no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingRequest.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para ver esta solicitud');
  }

  return existingRequest;
};

const updateRequestStatus = async (id, payload, user, ip) => {
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

  if (!estado || !ALLOWED_STATES.includes(estado)) {
    throw new Error('Estado no vÃ¡lido');
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

  const request = await contactRequestRepository.updateRequest(id, updatePayload);

  await auditService.recordAction({
    user,
    action: 'CAMBIAR_ESTADO_SOLICITUD',
    module: 'solicitudes_contacto',
    recordId: request.id,
    description: `Solicitud cambiada a ${request.estado}`,
    ip,
  });

  return request;
};

const updateRequest = async (id, payload, user, ip) => {
  const existingRequest = await contactRequestRepository.findRequestById(id);

  if (!existingRequest) {
    throw new Error('La solicitud no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingRequest.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para modificar esta solicitud');
  }

  const normalizedPayload = normalizeRequestPayload(payload);
  const updatePayload = {};

  ['pais_id', 'nombre', 'correo', 'telefono', 'finalidad', 'mensaje'].forEach(
    (field) => {
      if (normalizedPayload[field] !== undefined) {
        updatePayload[field] = normalizedPayload[field];
      }
    }
  );

  if (normalizedPayload.correo && !isValidEmail(normalizedPayload.correo)) {
    throw new Error('El correo electrÃ³nico no tiene un formato vÃ¡lido');
  }

  if (normalizedPayload.finalidad !== undefined) {
    validatePurpose(normalizedPayload.finalidad);
  }

  if (normalizedPayload.estado) {
    if (!ALLOWED_STATES.includes(normalizedPayload.estado)) {
      throw new Error('Estado no vÃ¡lido');
    }

    updatePayload.estado = normalizedPayload.estado;

    if (normalizedPayload.estado === 'gestionada' || normalizedPayload.estado === 'cerrada') {
      updatePayload.fecha_gestion = new Date().toISOString();
    }
  }

  if (normalizedPayload.observaciones_admin !== undefined) {
    updatePayload.observaciones_admin = normalizedPayload.observaciones_admin;
  }

  updatePayload.updated_at = new Date().toISOString();

  const request = await contactRequestRepository.updateRequest(id, updatePayload);

  await auditService.recordAction({
    user,
    action: 'ACTUALIZAR_SOLICITUD',
    module: 'solicitudes_contacto',
    recordId: request.id,
    description: `Solicitud de ${request.nombre} actualizada`,
    ip,
  });

  return request;
};

const deleteRequest = async (id, user, ip) => {
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

  await auditService.recordAction({
    user,
    action: 'ELIMINAR_SOLICITUD',
    module: 'solicitudes_contacto',
    recordId: existingRequest.id,
    description: `Solicitud de ${existingRequest.nombre} eliminada`,
    ip,
  });

  return {
    message: 'Solicitud eliminada correctamente',
  };
};

module.exports = {
  getRequests,
  createPublicRequest,
  getRequestById,
  updateRequestStatus,
  updateRequest,
  deleteRequest,
};
