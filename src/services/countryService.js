const countryRepository = require('../repositories/countryRepository');

const getCountries = async () => {
  return await countryRepository.findAllCountries();
};

const getActiveCountries = async () => {
  return await countryRepository.findActiveCountries();
};

module.exports = {
  getCountries,
  getActiveCountries,
};