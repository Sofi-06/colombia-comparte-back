const supabase = require('../config/supabase');

const findAllCountries = async () => {
  const { data, error } = await supabase
    .from('paises')
    .select('id, nombre, codigo, slug, estado, created_at')
    .order('nombre', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

const findCountryById = async (id) => {
  const { data, error } = await supabase
    .from('paises')
    .select('id, nombre, codigo, slug, estado, created_at')
    .eq('id', id)
    .maybeSingle();

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

const findCountryByCode = async (codigo) => {
  const { data, error } = await supabase
    .from('paises')
    .select('id, nombre, codigo, slug, estado')
    .eq('codigo', codigo)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const createCountry = async (payload) => {
  const { data, error } = await supabase
    .from('paises')
    .insert([payload])
    .select('id, nombre, codigo, slug, estado, created_at')
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateCountry = async (id, payload) => {
  const { data, error } = await supabase
    .from('paises')
    .update(payload)
    .eq('id', id)
    .select('id, nombre, codigo, slug, estado, created_at')
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteCountry = async (id) => {
  const { data, error } = await supabase
    .from('paises')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  findAllCountries,
  findCountryById,
  findActiveCountries,
  findCountryByCode,
  createCountry,
  updateCountry,
  deleteCountry,
};