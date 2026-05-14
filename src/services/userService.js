const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');

const getUsers = async () => {
  return await userRepository.findAllUsers();
};

const createUser = async (payload, actor, ip) => {
  const {
    nombre,
    apellido,
    email,
    username,
    password,
    rol_id,
    pais_id,
    pregunta_seguridad,
    respuesta_seguridad,
  } = payload;

  if (!nombre || !apellido || !email || !username || !password || !rol_id) {
    throw new Error('Nombre, apellido, email, username, password y rol son obligatorios');
  }

  const existingUser = await userRepository.findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    throw new Error('Ya existe un usuario con ese username o email');
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const userPayload = {
    nombre,
    apellido,
    email,
    username,
    password_hash,
    rol_id,
    pais_id: pais_id || null,
    estado: 'activo',
  };

  if (pregunta_seguridad && respuesta_seguridad) {
    userPayload.pregunta_seguridad = pregunta_seguridad;
    userPayload.respuesta_seguridad_hash = bcrypt.hashSync(respuesta_seguridad, 10);
  }

  const createdUser = await userRepository.createUser(userPayload);

  await auditService.recordAction({
    user: actor,
    action: 'CREAR_USUARIO',
    module: 'usuarios',
    recordId: createdUser.id,
    description: `Usuario ${createdUser.username} creado`,
    ip,
  });

  return createdUser;
};

const updateUser = async (id, payload, actor, ip) => {
  if (payload.password) {
    payload.password_hash = bcrypt.hashSync(payload.password, 10);
    delete payload.password;
  }

  if (payload.respuesta_seguridad) {
    payload.respuesta_seguridad_hash = bcrypt.hashSync(payload.respuesta_seguridad, 10);
    delete payload.respuesta_seguridad;
  }

  const updatedUser = await userRepository.updateUser(id, payload);

  await auditService.recordAction({
    user: actor,
    action: 'ACTUALIZAR_USUARIO',
    module: 'usuarios',
    recordId: updatedUser.id,
    description: `Usuario ${updatedUser.username} actualizado`,
    ip,
  });

  return updatedUser;
};

const changeUserPassword = async (id, { nueva_password }, actor, ip) => {
  if (!nueva_password) {
    throw new Error('nueva_password es obligatoria');
  }

  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);

  const result = await userRepository.updateUserPassword(id, password_hash);

  await auditService.recordAction({
    user: actor,
    action: 'CAMBIAR_PASSWORD_USUARIO',
    module: 'usuarios',
    recordId: result.id,
    description: `Contraseña actualizada para ${result.username}`,
    ip,
  });

  return result;
};

const deleteUser = async (id, actor, ip) => {
  const deletedUser = await userRepository.deleteUser(id);

  await auditService.recordAction({
    user: actor,
    action: 'ELIMINAR_USUARIO',
    module: 'usuarios',
    recordId: deletedUser.id,
    description: `Usuario ${deletedUser.username} eliminado`,
    ip,
  });

  return deletedUser;
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
};