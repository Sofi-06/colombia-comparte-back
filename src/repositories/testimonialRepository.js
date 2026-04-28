const supabase = require('../config/supabase');

const findAllTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonios')
    .select(`
      id,
      nombre,
      cargo,
      empresa,
      contenido,
      foto_url,
      instagram_url,
      facebook_url,
      estado,
      destacado,
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

const findTestimonialsByCountry = async (paisId) => {
  const { data, error } = await supabase
    .from('testimonios')
    .select(`
      id,
      nombre,
      cargo,
      empresa,
      contenido,
      foto_url,
      instagram_url,
      facebook_url,
      estado,
      destacado,
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

const findTestimonialById = async (id) => {
  const { data, error } = await supabase
    .from('testimonios')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const findPublishedTestimonialsByCountrySlug = async (countrySlug) => {
  const { data, error } = await supabase
    .from('testimonios')
    .select(`
      id,
      nombre,
      cargo,
      empresa,
      contenido,
      foto_url,
      instagram_url,
      facebook_url,
      destacado,
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
    .order('destacado', { ascending: false })
    .order('fecha_publicacion', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const createTestimonial = async (payload) => {
  const { data, error } = await supabase
    .from('testimonios')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateTestimonial = async (id, payload) => {
  const { data, error } = await supabase
    .from('testimonios')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteTestimonial = async (id) => {
  const { error } = await supabase
    .from('testimonios')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

module.exports = {
  findAllTestimonials,
  findTestimonialsByCountry,
  findTestimonialById,
  findPublishedTestimonialsByCountrySlug,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};