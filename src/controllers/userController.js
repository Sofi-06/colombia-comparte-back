const userService = require('../services/userService');

const listUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.changeUserPassword(id, req.body);

    return res.status(200).json({
      message: 'Contraseña actualizada correctamente',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);

    return res.status(200).json({
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
};