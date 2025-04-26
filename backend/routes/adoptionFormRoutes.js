import express from 'express';
import {
  createApplication,
  getUserApplications,
  updateApplication,
  deleteApplication,
  getAllApplications
} from '../controllers/adoptionFormControllers.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/apply', createApplication);
router.get('/my-applications', authMiddleware, getUserApplications);
router.put('/update/:id', updateApplication);
router.delete('/delete/:id', deleteApplication);
router.get('/all', getAllApplications);

export default router;
