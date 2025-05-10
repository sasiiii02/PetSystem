import express from 'express';
import {
  createHomeVisit,
  getAllHomeVisits,
  getHomeVisitById,
  updateHomeVisit,
  deleteHomeVisit,
  getUserHomeVisits
} from '../controllers/homeVisitControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(authMiddleware);

// Get all home visits (for adoption coordinators)
router.get('/', getAllHomeVisits);

// Get home visits for a specific user
router.get('/my-visits', getUserHomeVisits);

// Create a new home visit
router.post('/', createHomeVisit);

// Get, update, or delete a specific home visit
router.get('/:id', getHomeVisitById);
router.put('/:id', updateHomeVisit);
router.delete('/:id', deleteHomeVisit);

export default router; 