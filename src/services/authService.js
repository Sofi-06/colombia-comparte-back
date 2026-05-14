const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new Error('El usuario y la contraseña son obligatorios');
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (user.estado !== 'activo') {
    throw new Error('El usuario se encuentra inactivo');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Contraseña incorrecta');
  }

  await authRepository.updateLastAccess(user.id);

  const rol = user.roles?.nombre;
  const pais = user.paises || null;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      rol,
      pais_id: user.pais_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    message: 'Inicio de sesión exitoso',
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      username: user.username,
      rol,
      pais,
    },
  };
};

const forgotPassword = async ({ identifier }) => {
  if (!identifier) {
    throw new Error('El identificador es obligatorio');
  }

  const user = await authRepository.findUserByIdentifier(identifier);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (!user.pregunta_seguridad || !user.respuesta_seguridad_hash) {
    throw new Error('El usuario no tiene pregunta de seguridad configurada');
  }

  return {
    message: 'Pregunta de seguridad encontrada',
    username: user.username,
    pregunta_seguridad: user.pregunta_seguridad,
  };
};

const resetPassword = async ({ username, respuesta_seguridad, nueva_password }) => {
  if (!username || !respuesta_seguridad || !nueva_password) {
    throw new Error('username, respuesta_seguridad y nueva_password son obligatorios');
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (!user.respuesta_seguridad_hash) {
    throw new Error('El usuario no tiene pregunta de seguridad configurada');
  }

  const isValidAnswer = await bcrypt.compare(
    respuesta_seguridad,
    user.respuesta_seguridad_hash
  );

  if (!isValidAnswer) {
    throw new Error('Respuesta de seguridad incorrecta');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);

  await authRepository.updatePassword(user.id, password_hash);

  return {
    message: 'Contraseña actualizada correctamente',
  };
};

const changePassword = async (userId, { password_actual, nueva_password }) => {
  if (!password_actual || !nueva_password) {
    throw new Error('password_actual y nueva_password son obligatorios');
  }

  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isValidPassword = await bcrypt.compare(password_actual, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Contraseña actual incorrecta');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);

  await authRepository.updatePassword(user.id, password_hash);

  return {
    message: 'Contraseña actualizada correctamente',
  };
};

const updateSecurityQuestion = async (userId, { pregunta_seguridad, respuesta_seguridad }) => {
  if (!pregunta_seguridad || !respuesta_seguridad) {
    throw new Error('pregunta_seguridad y respuesta_seguridad son obligatorios');
  }

  const respuesta_seguridad_hash = bcrypt.hashSync(respuesta_seguridad, 10);

  return await authRepository.updateSecurityQuestion(userId, {
    pregunta_seguridad,
    respuesta_seguridad_hash,
  });
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateSecurityQuestion,
};