const supabase = require('../config/supabase');

const findAllRequests = async () => {
  const { data, error } = await supabase
    .from('solicitudes_contacto')
    .select(`
      id,
      nombre,
      correo,
      telefono,
      finalidad,
      mensaje,
      estado,
      observaciones_admin,
      fecha_gestion,
      created_at,
      updated_at,
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

const findRequestsByCountry = async (paisId) => {
  const { data, error } = await supabase
    .from('solicitudes_contacto')
    .select(`
      id,
      nombre,
      correo,
      telefono,
      finalidad,
      mensaje,
      estado,
      observaciones_admin,
      fecha_gestion,
      created_at,
      updated_at,
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

const findRequestById = async (id) => {
  const { data, error } = await supabase
    .from('solicitudes_contacto')
    .select(`
      id,
      pais_id,
      nombre,
      correo,
      telefono,
      finalidad,
      mensaje,
      estado,
      observaciones_admin,
      fecha_gestion,
      gestionado_por,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const findRequestDetailById = async (id) => {
  const { data, error } = await supabase
    .from('solicitudes_contacto')
    .select(`
      id,
      pais_id,
      nombre,
      correo,
      telefono,
      finalidad,
      mensaje,
      estado,
      observaciones_admin,
      fecha_gestion,
      gestionado_por,
      created_at,
      updated_at,
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
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const createRequest = async (payload) => {
  const { data, error } = await supabase
    .from('solicitudes_contacto')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateRequest = async (id, payload) => {
  const { data, error } = await supabase
    .from('solicitudes_contacto')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteRequest = async (id) => {
  const { error } = await supabase
    .from('solicitudes_contacto')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

module.exports = {
  findAllRequests,
  findRequestsByCountry,
  findRequestById,
  findRequestDetailById,
  createRequest,
  updateRequest,
  deleteRequest,
};