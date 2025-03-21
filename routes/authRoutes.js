const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const {authenticate} = require("../middleware/authMiddleware")

// Authentication Routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/profile", authenticate, AuthController.getProfile);
router.put("/profile", authenticate, AuthController.updateProfile);
router.post("/reset-password",  authenticate, AuthController.resetPassword);

module.exports = router;
