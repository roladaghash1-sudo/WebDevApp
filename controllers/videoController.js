// controllers/videoController.js
const favoritesService = require('../services/favoritesService');

// A small "mock" list of videos (no client project, no API required)
const MOCK_VIDEOS = [
    { id: 'v1', title: 'JavaScript Basics - Variables and Functions' },
    { id: 'v2', title: 'Node.js Express MVC Tutorial' },
    { id: 'v3', title: 'SQLite for Beginners (CRUD)' },
    { id: 'v4', title: 'Sessions & Authentication in Express' },
    { id: 'v5', title: 'Bootstrap Quick Start - Layout and Components' },
    { id: 'v6', title: 'Async/Await Explained Simply' },
];

// GET /videos?q=...
async function showVideosPage(req, res) {
    const user = req.session.user; // { id, email, fullName }
    const q = (req.query.q || '').trim().toLowerCase();

    // Filter mock results by query
    const results = q
        ? MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(q))
        : [];

    // Load favorites from DB for the logged-in user
    const favorites = await favoritesService.getUserFavorites(user.id);

    res.render('videos', {
        user,
        q: req.query.q || '',
        results,
        favorites
    });
}

// POST /favorites (save a video)
async function saveFavorite(req, res) {
    const user = req.session.user;
    const { videoId, title } = req.body;

    await favoritesService.saveFavorite(user.id, { id: videoId, title });

    // Redirect back to the videos page (keep the search query if exists)
    const backTo = req.body.backTo || '/videos';
    res.redirect(backTo);
}

// POST /favorites/delete (optional remove)
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
