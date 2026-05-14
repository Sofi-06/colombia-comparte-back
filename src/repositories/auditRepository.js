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

module.exports = {
  createAuditLog,
};