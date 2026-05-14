const countryService = require('../services/countryService');

const listCountries = async (req, res) => {
  try {
    const countries = await countryService.getCountries();

    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await countryService.getCountryById(id);

    return res.status(200).json(country);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const listActiveCountries = async (req, res) => {
  try {
    const countries = await countryService.getActiveCountries();

    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createCountry = async (req, res) => {
  try {
    const country = await countryService.createCountry(req.body);

    return res.status(201).json({
      message: 'País creado correctamente',
      data: country,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await countryService.updateCountry(id, req.body);

    return res.status(200).json({
      message: 'País actualizado correctamente',
      data: country,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    await countryService.deleteCountry(id);

    return res.status(200).json({
      message: 'País eliminado correctamente',
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listCountries,
  getCountry,
  listActiveCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};