const countryRepository = require('../repositories/countryRepository');

const getCountries = async () => {
  return await countryRepository.findAllCountries();
};

const getCountryById = async (id) => {
  const country = await countryRepository.findCountryById(id);
  if (!country) {
    throw new Error('País no encontrado');
  }
  return country;
};

const getActiveCountries = async () => {
  return await countryRepository.findActiveCountries();
};

const createCountry = async (payload) => {
  const { nombre, codigo, slug } = payload;

  if (!nombre || !codigo || !slug) {
    throw new Error('Nombre, código y slug son obligatorios');
  }

  // Verificar si el código ya existe
  const existingCountry = await countryRepository.findCountryByCode(codigo);
  if (existingCountry) {
    throw new Error('Ya existe un país con ese código');
  }

  const countryPayload = {
    nombre,
    codigo: codigo.toUpperCase(),
    slug: slug.toLowerCase(),
    estado: payload.estado || 'activo',
  };

  return await countryRepository.createCountry(countryPayload);
};

const updateCountry = async (id, payload) => {
  const country = await countryRepository.findCountryById(id);
  if (!country) {
    throw new Error('País no encontrado');
  }

  // Si se actualiza el código, verificar que no exista otro con ese código
  if (payload.codigo && payload.codigo !== country.codigo) {
    const existingCountry = await countryRepository.findCountryByCode(payload.codigo);
    if (existingCountry) {
      throw new Error('Ya existe un país con ese código');
    }
    payload.codigo = payload.codigo.toUpperCase();
  }

  if (payload.slug) {
    payload.slug = payload.slug.toLowerCase();
  }

  return await countryRepository.updateCountry(id, payload);
};

const deleteCountry = async (id) => {
  const country = await countryRepository.findCountryById(id);
  if (!country) {
    throw new Error('País no encontrado');
  }

  return await countryRepository.deleteCountry(id);
};

module.exports = {
  getCountries,
  getCountryById,
  getActiveCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};