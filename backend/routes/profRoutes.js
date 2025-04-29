import express from 'express';
import { 
  profLogin, 
  profRegister, 
  profLogout,
  loginLimiter 
} from '../controllers/profController.js';
import { profAuth } from '../middleware/profMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginLimiter, profLogin);
router.post('/register', profRegister);

// Protected route
router.post('/logout', profAuth, profLogout);

export default router;