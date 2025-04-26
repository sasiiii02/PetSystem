import express from 'express';
import { registerPet, getUserPets } from '../controllers/petController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a new pet
router.post('/registerPet', authMiddleware, registerPet);

// Get all pets for the authenticated user
router.get('/getUserPets', authMiddleware, getUserPets);

export default router;