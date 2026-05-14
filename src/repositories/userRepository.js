const supabase = require('../config/supabase');

const findAllUsers = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      pregunta_seguridad,
      created_at,
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
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

const findUserByUsernameOrEmail = async (username, email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, username, email')
    .or(`username.eq.${username},email.eq.${email}`)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const findUserById = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      pregunta_seguridad,
      roles (
        id,
        nombre
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const createUser = async (payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([payload])
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      pregunta_seguridad,
      created_at
    `)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateUser = async (id, payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id', id)
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      pregunta_seguridad,
      created_at
    `)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateUserPassword = async (id, password_hash) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update({
      password_hash,
      password_updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, username')
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateSecurityQuestion = async (id, payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id', id)
    .select('id, username, pregunta_seguridad')
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  findAllUsers,
  findUserByUsernameOrEmail,
  findUserById,
  createUser,
  updateUser,
  updateUserPassword,
  updateSecurityQuestion,
  deleteUser,
};