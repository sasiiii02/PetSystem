import express from "express";
import { registerUser, loginUser, getUserProfile, updateProfile , deleteProfile, getAllUsers,deleteProfileById } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);
router.post("/updateProfile",auth, updateProfile);
router.post("/deleteProfile",auth, deleteProfile);
router.get('/all', auth, getAllUsers);
router.post('/deleteProfile/:id', auth, deleteProfileById);

export default router;