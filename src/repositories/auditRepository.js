const supabase = require('../config/supabase');

const createAuditLog = async (payload) => {
  const { data, error } = await supabase
    .from('bitacora_auditoria')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const findAuditLogs = async ({ limit = 50, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('bitacora_auditoria')
    .select(`
      id,
      action:accion,
      module:modulo,
      description:descripcion,
      created_at,
      ip,
      usuario_id,
      usuarios ( id, nombre, apellido, email )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, Math.max(offset + limit - 1, offset));

  if (error) throw new Error(error.message);

  return {
    records: data,
    total: count ?? data?.length ?? 0,
  };
};

module.exports = {
  createAuditLog,
  findAuditLogs,
};
