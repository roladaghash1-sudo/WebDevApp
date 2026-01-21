const db = require('../config/db');

// 1) Create table
function createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, videoId)
    )
  `;

    db.run(sql, (err) => {
        if (err) {
            console.error("Error creating favorites table:", err);
        } else {
            console.log("Favorites table ready");
        }
    });
}

// 2) Add favorite
function addFavorite(userId, videoId, title, callback) {
    const sql = `
    INSERT OR IGNORE INTO favorites (userId, videoId, title)
    VALUES (?, ?, ?)
  `;
    db.run(sql, [userId, videoId, title], callback);
}

// 3) Get favorites by user
function getFavoritesByUser(userId, callback) {
    const sql = `
    SELECT * FROM favorites
    WHERE userId = ?
    ORDER BY createdAt DESC
  `;
    db.all(sql, [userId], callback);
}

// 4) Remove favorite (optional)
function removeFavorite(userId, videoId, callback) {
    const sql = `
    DELETE FROM favorites
    WHERE userId = ? AND videoId = ?
  `;
    db.run(sql, [userId, videoId], callback);
}

module.exports = {
    createTable,
    addFavorite,
    getFavoritesByUser,
    removeFavorite,
};
