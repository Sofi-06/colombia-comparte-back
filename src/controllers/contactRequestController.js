const contactRequestService = require('../services/contactRequestService');

const listRequests = async (req, res) => {
  try {
    const requests = await contactRequestService.getRequests(req.user);

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createPublicRequest = async (req, res) => {
  try {
    const request = await contactRequestService.createPublicRequest(req.body);

    return res.status(201).json({
      message: 'Solicitud enviada correctamente',
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await contactRequestService.getRequestById(id, req.user);

    return res.status(200).json(request);
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

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await contactRequestService.updateRequestStatus(
      id,
      req.body,
      req.user
    );

    return res.status(200).json({
      message: 'Solicitud actualizada correctamente',
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await contactRequestService.updateRequest(id, req.body, req.user);

    return res.status(200).json({
      message: 'Solicitud actualizada correctamente',
      data: request,
    });
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

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await contactRequestService.deleteRequest(id, req.user);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listRequests,
  createPublicRequest,
  getRequestById,
  updateRequestStatus,
  updateRequest,
  deleteRequest,
};