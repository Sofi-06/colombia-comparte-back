const supabase = require('../config/supabase');

const findAllNews = async () => {
  const { data, error } = await supabase
    .from('noticias')
    .select(`
      id,
      titulo,
      slug,
      resumen,
      contenido,
      imagen_principal_url,
      estado,
      fecha_publicacion,
      created_at,
      paises (
        id,
        nombre,
        codigo,
        slug
      ),
      usuarios (
        id,
        nombre,
        apellido,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const findNewsByCountry = async (paisId) => {
  const { data, error } = await supabase
    .from('noticias')
    .select(`
      id,
      titulo,
      slug,
      resumen,
      contenido,
      imagen_principal_url,
      estado,
      fecha_publicacion,
      created_at,
      paises (
        id,
        nombre,
        codigo,
        slug
      ),
      usuarios (
        id,
        nombre,
        apellido,
        email
      )
    `)
    .eq('pais_id', paisId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const findNewsById = async (id) => {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const findPublishedNewsByCountrySlug = async (countrySlug) => {
  const { data, error } = await supabase
    .from('noticias')
    .select(`
      id,
      titulo,
      slug,
      resumen,
      imagen_principal_url,
      fecha_publicacion,
      paises!inner (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .eq('estado', 'publicado')
    .eq('paises.slug', countrySlug)
    .order('fecha_publicacion', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const findPublishedNewsDetailByCountryAndSlug = async (countrySlug, newsSlug) => {
  const { data, error } = await supabase
    .from('noticias')
    .select(`
      id,
      titulo,
      slug,
      resumen,
      contenido,
      imagen_principal_url,
      fecha_publicacion,
      paises!inner (
        id,
        nombre,
        codigo,
        slug
      ),
      usuarios (
        id,
        nombre,
        apellido
      )
    `)
    .eq('estado', 'publicado')
    .eq('paises.slug', countrySlug)
    .eq('slug', newsSlug)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const createNews = async (payload) => {
  const { data, error } = await supabase
    .from('noticias')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateNews = async (id, payload) => {
  const { data, error } = await supabase
    .from('noticias')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteNews = async (id) => {
  const { error } = await supabase
    .from('noticias')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

module.exports = {
  findAllNews,
  findNewsByCountry,
  findNewsById,
  findPublishedNewsByCountrySlug,
  findPublishedNewsDetailByCountryAndSlug,
  createNews,
  updateNews,
  deleteNews,
};