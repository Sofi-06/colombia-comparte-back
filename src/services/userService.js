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
  } = payload;

  if (!nombre || !apellido || !email || !username || !password || !rol_id) {
    throw new Error('Nombre, apellido, email, username, password y rol son obligatorios');
  }

  const existingUser = await userRepository.findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    throw new Error('Ya existe un usuario con ese username o email');
  }

  const password_hash = bcrypt.hashSync(password, 10);

  return await userRepository.createUser({
    nombre,
    apellido,
    email,
    username,
    password_hash,
    rol_id,
    pais_id: pais_id || null,
    estado: 'activo',
  });
};

module.exports = {
  getUsers,
  createUser,
};