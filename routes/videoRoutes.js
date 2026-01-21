// routes/videoRoutes.js
const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/requireAuth');
const videoController = require('../controllers/videoController');

// Videos page (protected)
router.get('/videos', requireAuth, videoController.showVideosPage);

// Save favorite (protected)
router.post('/favorites', requireAuth, videoController.saveFavorite);

// Remove favorite (optional)
router.post('/favorites/delete', requireAuth, videoController.deleteFavorite);

module.exports = router;
