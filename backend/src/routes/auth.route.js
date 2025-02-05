import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js"; // Importez les nouvelles fonctions
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes existantes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// Nouvelles routes pour Forgot et Reset Password
router.post("/forgot-password", forgotPassword); // Route pour demander une réinitialisation de mot de passe
router.post("/reset-password/:token", resetPassword); // Route pour réinitialiser le mot de passe

export default router;