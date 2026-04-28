const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/me', verifyToken, profileController.getProfile);

module.exports = router;