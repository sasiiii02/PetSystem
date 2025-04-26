import express from "express";
import { registerProfessional, loginProfessional, getProfile,getAllProfessionals,updateProfessional,deleteProfileById } from "../controllers/professionalController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerProfessional);
router.post("/login", loginProfessional);
router.get("/profile", auth, getProfile);
router.get('/all', auth, getAllProfessionals);
router.put('/update/:id', auth, updateProfessional);
router.post('/delete/:id', auth, deleteProfileById);

export default router;