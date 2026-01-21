const express = require("express");
const path = require("path");

const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middleware/requireAuth");

const favoritesRepo = require("./repositories/favoritesRepository");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

// Create favorites table if not exists
favoritesRepo.createTable();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// body parsing
app.use(express.urlencoded({ extended: true }));

// sessions
app.use(sessionMiddleware);

// make user available in views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// routes
app.use(authRoutes);
app.use(videoRoutes);

// Home -> redirect depending on auth
app.get("/", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    return res.redirect("/videos");
});

// fallback 404 (keep it LAST)
app.use((req, res) => {
    res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`http://localhost:${PORT}`));
