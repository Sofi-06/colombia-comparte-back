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
      created_at
    `)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  findAllUsers,
  findUserByUsernameOrEmail,
  createUser,
};