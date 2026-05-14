const archivoService = require('../services/archivoService');

const listFiles = async (req, res) => {
  try {
    const files = await archivoService.getFiles(req.user, req.query);

    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await archivoService.getFileById(id, req.user);

    return res.status(200).json(file);
  } catch (error) {
    if (error.message.includes('permisos')) {
      return res.status(403).json({
        message: error.message,
      });
    }

    return res.status(404).json({
      message: error.message,
    });
  }
};

const uploadFile = async (req, res) => {
  try {
    const file = await archivoService.uploadFile(
      {
        ...req.body,
        file: req.file,
      },
      req.user,
      req.ip
    );

    return res.status(201).json({
      message: 'Archivo subido correctamente',
      data: file,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await archivoService.deleteFile(id, req.user, req.ip);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('permisos')) {
      return res.status(403).json({
        message: error.message,
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listFiles,
  getFileById,
  uploadFile,
  deleteFile,
};