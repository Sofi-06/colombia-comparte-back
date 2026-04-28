const supabase = require('../config/supabase');

const findAllCountries = async () => {
  const { data, error } = await supabase
    .from('paises')
    .select('id, nombre, codigo, slug, estado, created_at')
    .order('nombre', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

const findActiveCountries = async () => {
  const { data, error } = await supabase
    .from('paises')
    .select('id, nombre, codigo, slug')
    .eq('estado', 'activo')
    .order('nombre', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  findAllCountries,
  findActiveCountries,
};