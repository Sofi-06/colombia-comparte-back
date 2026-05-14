const auditRepository = require('../repositories/auditRepository');

const listAudits = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const result = await auditRepository.findAuditLogs({ limit, offset });
    return res.json({
      audits: result.records,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message ?? 'Error al obtener bitácora.' });
  }
};

module.exports = {
  listAudits,
};
