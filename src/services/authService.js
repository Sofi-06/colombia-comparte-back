const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const resolveRedirectPath = (rol, paisSlug) => {
  if (rol === 'superadmin') {
    return '/admin/dashboard/global';
  }

  if (rol === 'admin_pais') {
    return `/admin/dashboard/${paisSlug || 'pais'}`;
  }

  if (rol === 'editor') {
    return `/admin/editor/${paisSlug || 'pais'}`;
  }

  return '/';
};

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
  const paisSlug = pais?.slug || null;
  const redirect_to = resolveRedirectPath(rol, paisSlug);

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      rol,
      pais_id: user.pais_id,
      pais_slug: paisSlug,
      pais_nombre: pais?.nombre || null,
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
      pais_id: user.pais_id,
      pais,
    },
    session: {
      rol,
      pais_id: user.pais_id,
      pais_slug: paisSlug,
      redirect_to,
    },
    redirect_to,
  };
};

module.exports = {
  login,
};