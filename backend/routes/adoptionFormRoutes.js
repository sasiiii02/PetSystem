import express from 'express';
import {
  createApplication,
  getUserApplications,
  updateApplication,
  deleteApplication,
  getAllApplications,
  getApplicationById
} from '../controllers/adoptionFormControllers.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/apply', createApplication);
router.get('/my-applications', authMiddleware, getUserApplications);
router.get('/:id', authMiddleware, getApplicationById);
router.put('/update/:id', authMiddleware, updateApplication);
router.delete('/delete/:id', authMiddleware, deleteApplication);
router.get('/all', authMiddleware, getAllApplications);

export default router;
