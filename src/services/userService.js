const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const getUsers = async () => {
  return await userRepository.findAllUsers();
};

const createUser = async (payload) => {
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

  return await userRepository.createUser(userPayload);
};

const updateUser = async (id, payload) => {
  if (payload.password) {
    payload.password_hash = bcrypt.hashSync(payload.password, 10);
    delete payload.password;
  }

  if (payload.respuesta_seguridad) {
    payload.respuesta_seguridad_hash = bcrypt.hashSync(payload.respuesta_seguridad, 10);
    delete payload.respuesta_seguridad;
  }

  return await userRepository.updateUser(id, payload);
};

const changeUserPassword = async (id, { nueva_password }) => {
  if (!nueva_password) {
    throw new Error('nueva_password es obligatoria');
  }

  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);

  return await userRepository.updateUserPassword(id, password_hash);
};

const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
};