const supabase = require('../config/supabase');

const findFiles = async ({ modulo, referenciaId, subidoPor } = {}) => {
  let query = supabase.from('archivos').select(`
      id,
      nombre_archivo,
      url,
      tipo_archivo,
      modulo,
      referencia_id,
      subido_por,
      created_at,
      updated_at,
      usuarios (
        id,
        nombre,
        apellido,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (modulo) {
    query = query.eq('modulo', modulo);
  }

  if (referenciaId !== undefined) {
    query = query.eq('referencia_id', referenciaId);
  }

  if (subidoPor !== undefined && subidoPor !== null) {
    query = query.eq('subido_por', subidoPor);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const findFileById = async (id) => {
  const { data, error } = await supabase
    .from('archivos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const createFile = async (payload) => {
  const { data, error } = await supabase
    .from('archivos')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const deleteFile = async (id) => {
  const { error } = await supabase
    .from('archivos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  findFiles,
  findFileById,
  createFile,
  deleteFile,
};