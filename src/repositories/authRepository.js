const supabase = require('../config/supabase');

const findUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      password_hash,
      respuesta_seguridad_hash,
      pregunta_seguridad,
      estado,
      pais_id,
      roles (
        id,
        nombre
      ),
      paises (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .eq('username', username)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const findUserByIdentifier = async (identifier) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      password_hash,
      respuesta_seguridad_hash,
      pregunta_seguridad,
      estado,
      pais_id,
      roles (
        id,
        nombre
      ),
      paises (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const findUserById = async (userId) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      password_hash,
      respuesta_seguridad_hash,
      pregunta_seguridad,
      estado,
      pais_id,
      roles (
        id,
        nombre
      ),
      paises (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateLastAccess = async (userId) => {
  const { error } = await supabase
    .from('usuarios')
    .update({ ultimo_acceso: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
};

const updatePassword = async (userId, password_hash) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update({
      password_hash,
      password_updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, username')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateSecurityQuestion = async (userId, payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id', userId)
    .select('id, username, pregunta_seguridad')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  findUserByUsername,
  findUserByIdentifier,
  findUserById,
  updateLastAccess,
  updatePassword,
  updateSecurityQuestion,
};