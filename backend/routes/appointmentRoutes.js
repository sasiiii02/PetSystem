import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createAppointment,
  getRefundRequests,
  cancelAppointment,
  cancelAppointmentWithRefund,
  getGroomerAppointments,
  getTrainerAppointments,
  createAvlReqAppointment,
  getVeterinarianAppointments,
  getAllCancelledAppointments,
  getVeterinarianAppointmentsRequest,
  getActiveAppointments,
  getGroomerAppointmentsRequest,
  getPetTrainerAppointmentsRequest,
  denyAppointment,
  acceptAppointment,
  updateRefundStatus,
  confirmPayment
} from '../controllers/appointmentController.js';

const router = express.Router();

// POST route to create a new appointment
router.post('/create', auth, createAppointment);
// GET route for payment confirmation
router.get('/confirm', auth, confirmPayment);

// Regular cancellation (without refund)
router.patch('/:id/cancel', auth, cancelAppointment);

// Cancellation with refund request
router.patch('/:id/cancel-with-refund', auth, cancelAppointmentWithRefund);

// Get all refund requests
router.get('/refunds', auth, getRefundRequests);

router.get('/groomer-appointments', getGroomerAppointments);
router.get('/trainer-appointments', getTrainerAppointments);
router.get('/veterinarian-appointments', getVeterinarianAppointments);
router.get('/all-cancelled-appointments', getAllCancelledAppointments);

// New route for fetching logged-in user's active appointments
router.get('/active', auth, getActiveAppointments);

router.post('/ReqAvlTemp', createAvlReqAppointment);

router.get('/veterinarian-Reqappointments', getVeterinarianAppointmentsRequest);
router.get('/groomer-Reqappointments', getGroomerAppointmentsRequest);
router.get('/pet-trainer-Reqappointments', getPetTrainerAppointmentsRequest);

router.patch('/:id/deny', denyAppointment);
router.patch('/:id/accept', acceptAppointment);

router.patch('/refunds/:id/status', updateRefundStatus);

export default router;