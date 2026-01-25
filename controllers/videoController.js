// controllers/videoController.js

const favoritesService = require('../services/favoritesService');
const { searchYouTube } = require("../services/youtubeService");

// GET /videos?q=...
async function showVideosPage(req, res) {
    const user = req.session.user; // { id, email, fullName }
    const qRaw = (req.query.q || '').trim();

    let results = [];
    let error = null;

    try {
        if (qRaw) {
            // Call YouTube API (returns normalized objects)
            const ytResults = await searchYouTube(qRaw, 10);

            // Keep your old view structure: results with {id, title}
            results = ytResults.map(v => ({
                id: v.videoId,
                title: v.title,
            }));
        }
    } catch (e) {
        error = e.message || "YouTube search failed";
        results = [];
    }

    // Load favorites from DB for the logged-in user
    const favorites = await favoritesService.getUserFavorites(user.id);

    res.render('videos', {
        user,
        q: qRaw,
        results,
        favorites,
        error,
    });
}

// POST /favorites (save a video)
async function saveFavorite(req, res) {
    const user = req.session.user;
    const { videoId, title } = req.body;

    // You already store favorites as { id, title }
    await favoritesService.saveFavorite(user.id, { id: videoId, title });

    // Redirect back to the videos page (keep the search query if exists)
    const backTo = req.body.backTo || '/videos';
    res.redirect(backTo);
}

// POST /favorites/delete (remove)
async function deleteFavorite(req, res) {
    const user = req.session.user;
    const { videoId } = req.body;

    await favoritesService.deleteFavorite(user.id, videoId);

    const backTo = req.body.backTo || '/videos';
    res.redirect(backTo);
}

module.exports = {
    showVideosPage,
    saveFavorite,
    deleteFavorite,
};
