const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const countryRoutes = require('./routes/countryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRequestRoutes = require('./routes/contactRequestRoutes');
const archivoRoutes = require('./routes/archivoRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const REQUEST_BODY_LIMIT = process.env.REQUEST_BODY_LIMIT || '15mb';

// Middlewares
app.use(cors());
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'API CMS Multipais funcionando correctamente',
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact-requests', contactRequestRoutes);
app.use('/api/archivos', archivoRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/audits', auditRoutes);

app.use((error, req, res, next) => {
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      message:
        'El archivo enviado es demasiado grande. Intenta subir una imagen mas liviana.',
    });
  }

  return next(error);
});

// Servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
