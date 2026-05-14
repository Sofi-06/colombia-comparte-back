const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateSecurityQuestion = async (req, res) => {
  try {
    const result = await authService.updateSecurityQuestion(req.user.id, req.body);

    return res.status(200).json({
      message: 'Pregunta de seguridad actualizada correctamente',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateSecurityQuestion,
};