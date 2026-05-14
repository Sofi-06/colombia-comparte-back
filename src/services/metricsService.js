const supabase = require('../config/supabase');

async function countTable(table, paisId = null, extraFilter = null) {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });

  if (paisId != null) {
    query = query.eq('pais_id', paisId);
  }

  if (extraFilter && typeof extraFilter === 'function') {
    query = extraFilter(query);
  }

  const { count, error } = await query;

  if (error) throw new Error(error.message);

  return Number(count ?? 0);
}

async function getMetricsForUser(user) {
  const role = (user?.rol ?? '').toString().trim().toLowerCase();
  const paisId = user?.pais_id ?? null;

  const scopePais = role === 'superadmin' ? null : paisId;

  const [usersCount, newsCount, publishedNewsCount, testimonialsCount, publishedTestimonialsCount, requestsCount, pendingRequestsCount] = await Promise.all([
    // Users: count users within scope (if not superadmin count by pais_id)
    countTable('usuarios', scopePais),
    // News
    countTable('noticias', scopePais),
    // Published news
    countTable('noticias', scopePais, (q) => q.eq('estado', 'publicado')),
    // Testimonials
    countTable('testimonios', scopePais),
    // Published testimonials
    countTable('testimonios', scopePais, (q) => q.eq('estado', 'publicado')),
    // Contact requests
    countTable('solicitudes_contacto', scopePais),
    // Pending requests (estado != gestionado or estado = 'pendiente')
    countTable('solicitudes_contacto', scopePais, (q) => q.eq('estado', 'pendiente')),
  ]);

  return {
    users: usersCount,
    news: newsCount,
    news_published: publishedNewsCount,
    testimonials: testimonialsCount,
    testimonials_published: publishedTestimonialsCount,
    requests: requestsCount,
    requests_pending: pendingRequestsCount,
  };
}

module.exports = {
  getMetricsForUser,
};
