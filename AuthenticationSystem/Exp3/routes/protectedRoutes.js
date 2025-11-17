const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Admin-only route
router.get("/admin-dashboard", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin dashboard",
    user: req.user,
  });
});

// Moderator-only route
router.get("/moderator-panel", verifyToken, authorizeRoles("Moderator"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the Moderator panel",
    user: req.user,
  });
});

// General User route
router.get("/user-profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to your profile, ${req.user.username}`,
    user: req.user,
  });
});

module.exports = router;
