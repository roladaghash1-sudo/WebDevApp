// services/favoritesService.js
// This service contains the business logic related to favorites.
// It acts as a layer between the controller and the repository (database).

const favoritesRepo = require('../repositories/favoritesRepository');

// Save a video as a favorite for a specific user
// userId  - ID of the logged-in user
// video   - video object containing id and title
function saveFavorite(userId, video) {
    return new Promise((resolve, reject) => {

        // Basic validation to make sure the video data is valid
        if (!video || !video.id || !video.title) {
            return reject(new Error('Invalid video data'));
        }

        // Delegate the actual database insertion to the repository
        favoritesRepo.addFavorite(
            userId,
            video.id,
            video.title,
            (err) => {
                if (err) return reject(err);
                resolve(); // Favorite saved successfully
            }
        );
    });
}

// Retrieve all favorite videos for a specific user
// Returns an array of favorite records from the database
function getUserFavorites(userId) {
    return new Promise((resolve, reject) => {

        // Fetch favorites from the repository layer
        favoritesRepo.getFavoritesByUser(userId, (err, rows) => {
            if (err) return reject(err);
            resolve(rows); // Resolve with the list of favorites
        });
    });
}

// Remove a favorite video for a specific user (optional feature)
// userId  - ID of the logged-in user
// videoId - ID of the video to remove
function deleteFavorite(userId, videoId) {
    return new Promise((resolve, reject) => {

        // Ask the repository to delete the favorite record
        favoritesRepo.removeFavorite(userId, videoId, (err) => {
            if (err) return reject(err);
            resolve(); // Favorite removed successfully
        });
    });
}

module.exports = {
    saveFavorite,
    getUserFavorites,
    deleteFavorite,
};
