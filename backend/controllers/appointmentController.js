import mongoose from 'mongoose'; // Add this line
import Appointment from '../models/Appointment.js';
import RefundRequest from '../models/AppointmentrefundRequestModel.js';
import AppointmentTemp from  '../models/appointmentTempModel.js';
import ConfirmAppointmentReq from '../models/confirmAppointmentReqModel.js';
import { v4 as uuidv4 } from 'uuid';
import Stripe from "stripe";
const stripe = new Stripe("sk_test_51R9BsuQev5RhdlHVtR3ArfZEHEJNPqbRk3d2STp9KuvatV2uq6KjSegkDo0U8mg8RVLi89KtpYEMEQUw7zdXnm8F00msDdVYFS");


export const createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user || !req.user.userId) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: "User authentication required" });
    }
    const userId = req.user.userId;

    const { doctorId, appointmentDate, appointmentTime, userName, phoneNo, email, appointmentType, appointmentFee } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime || !userName || !phoneNo || !email || !appointmentType || !appointmentFee) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    if (isNaN(appointmentFee) || Number(appointmentFee) <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid appointment fee" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNo)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid phone number format (must be 10 digits)" });
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: parsedDate,
      appointmentTime,
    }).session(session);

    if (existingAppointment) {
      await session.abortTransaction();
      return res.status(409).json({ success: false, message: "Time slot already booked" });
    }

    const newAppointment = new Appointment({
      userId,
      doctorId,
      appointmentDate: parsedDate,
      appointmentTime,
      userName,
      phoneNo,
      email,
      appointmentType,
      appointmentFee,
    });

    await newAppointment.save({ session });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)} Appointment with ${doctorId}`,
              description: `Date: ${parsedDate.toDateString()}, Time: ${appointmentTime}`,
            },
            unit_amount: Math.round(appointmentFee * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&appointment_id=${newAppointment._id}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: { appointmentId: newAppointment._id.toString() },
    });

    newAppointment.paymentIntentId = checkoutSession.payment_intent;
    await newAppointment.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Proceed to payment",
      checkoutUrl: checkoutSession.url,
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating appointment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  } finally {
    session.endSession();
  }
};

export const confirmPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sessionId, appointmentId } = req.query;
    const userId = req.user.userId;

    console.log("Payment Confirmation Request:", {
      sessionId,
      appointmentId,
      userId
    });

    // Validate inputs
    if (!sessionId || !sessionId.startsWith('cs_')) {
      throw new Error("Invalid Stripe session ID");
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid appointment ID");
    }

    // Find appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId
    }).session(session);

    if (!appointment) {
      throw new Error("Appointment not found or doesn't belong to user");
    }

    // Verify Stripe session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    console.log("Stripe Session Details:", {
      payment_status: checkoutSession.payment_status,
      amount_total: checkoutSession.amount_total,
      metadata: checkoutSession.metadata
    });

    if (checkoutSession.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Verify amount matches
    const expectedAmount = Math.round(appointment.appointmentFee * 100);
    if (checkoutSession.amount_total !== expectedAmount) {
      throw new Error("Payment amount mismatch");
    }

    // Update appointment
    appointment.paymentStatus = "paid";
    appointment.paymentDate = new Date();
    appointment.paymentIntentId = checkoutSession.payment_intent.id;
    
    await appointment.save({ session });
    await session.commitTransaction();

    console.log("Payment confirmed successfully for appointment:", appointmentId);
    
    res.status(200).json({ 
      success: true,
      message: "Payment confirmed successfully",
      appointment: {
        id: appointment._id,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Payment Confirmation Error:", {
      message: error.message,
      stack: error.stack
    });

    res.status(400).json({ 
      success: false,
      message: error.message || "Payment confirmation failed",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    session.endSession();
  }
};








export const getActiveAppointments = async (req, res) => {
  try {
    // Step 1: Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }
    const userId = req.user.userId;

    // Step 2: Fetch active appointments for the logged-in user
    const currentDate = new Date(); // Get today's date
    const activeAppointments = await Appointment.find({
      userId: userId, // Match the authenticated user's ID
      appointmentDate: { $gte: currentDate }, // Only future or today's appointments
    })
      .sort({ appointmentDate: 1, appointmentTime: 1 }) // Sort by date and time ascending
      .exec();

    // Step 3: Check if there are any appointments
    if (!activeAppointments || activeAppointments.length === 0) {
      return res.status(404).json({ success: false, message: "No active appointments found" });
    }

    // Step 4: Return the active appointments
    res.status(200).json({
      success: true,
      message: "Active appointments retrieved successfully",
      appointments: activeAppointments,
    });
  } catch (error) {
    // Step 5: Handle errors
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
};






















// Regular cancellation
export const cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if user is authenticated
    if (!req.user || !req.user.userId) {
      await session.abortTransaction();
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication required' 
      });
    }
    const userId = req.user.userId; // From JWT token

    // Step 2: Get the appointment ID from params
    const { id } = req.params;
    const appointment = await Appointment.findById(id).session(session);

    if (!appointment) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Step 3: Verify the appointment belongs to the user
    if (appointment.userId.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({ 
        success: false, 
        message: 'You can only cancel your own appointments' 
      });
    }

    // Step 4: Check if the appointment can be cancelled
    if (appointment.status !== 'scheduled') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel appointment with status: ${appointment.status}`
      });
    }

    // Step 5: Cancel the appointment
    appointment.status = 'cancelled';
    await appointment.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {
        _id: appointment._id,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status
      } // Return minimal data
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};



async function sendRefundNotification(userId, refundId) {
  // Implementation options:
  
  // 1. Console log (for development)
  console.log(`Refund notification: User ${userId} for refund ${refundId}`);}










  
  // Cancel appointment with refund
  export const cancelAppointmentWithRefund = async (req, res) => {
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      // Check authentication
      if (!req.user || !req.user.userId) {
        await session.abortTransaction();
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      const userId = req.user.userId;
  
      // Extract and validate input
      const { id } = req.params;
      const { refundReason, paymentMethod = 'credit_card' } = req.body;
  
      console.log('Received paymentMethod:', paymentMethod); // Debug line
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment ID'
        });
      }
  
      if (!refundReason?.trim() || refundReason.trim().length < 10) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Refund reason is required and must be at least 10 characters'
        });
      }
  
      // Find the appointment
      const appointment = await Appointment.findById(id).session(session);
      if (!appointment) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
  
      // Verify ownership
      if (appointment.userId.toString() !== userId) {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: 'You can only cancel your own appointments'
        });
      }
  
      // Check for existing refund request
      const existingRefund = await RefundRequest.findOne({ appointmentId: id }).session(session);
      if (existingRefund) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Refund already requested for this appointment'
        });
      }
  
      // Validate appointment status
      if (appointment.status !== 'scheduled') {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Cannot cancel appointment with status: ${appointment.status}`
        });
      }
  
      // Check if appointment is in the past
      const appointmentDateUTC = new Date(appointment.appointmentDate);
      const appointmentTimeUTC = new Date(`1970-01-01T${appointment.appointmentTime}Z`);
      const appointmentDateTime = new Date(
        appointmentDateUTC.getFullYear(),
        appointmentDateUTC.getMonth(),
        appointmentDateUTC.getDate(),
        appointmentTimeUTC.getHours(),
        appointmentTimeUTC.getMinutes()
      );
  
      if (appointmentDateTime < new Date()) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel past appointments'
        });
      }
  
      // Create refund request
      const processingFeePercentage = 0.10;
      const processingFee = parseFloat((appointment.appointmentFee * processingFeePercentage).toFixed(2));
      const netAmount = parseFloat((appointment.appointmentFee - processingFee).toFixed(2));
  
      const paymentMethodValue = paymentMethod || 'credit_card'; // Ensure it’s never undefined
      console.log('Using paymentMethodValue:', paymentMethodValue); // Debug line
  
      const refundRequest = new RefundRequest({
        appointmentId: appointment._id,
        userId: appointment.userId,
        paymentMethod: paymentMethodValue, // Use the forced value
        amount: appointment.appointmentFee,
        processingFee,
        netAmount,
        reason: refundReason,
        status: 'pending',
        metadata: {
          cancelledBy: userId,
          cancellationDate: new Date()
        }
      });
  
      // Save both records
      await refundRequest.save({ session });
      appointment.status = 'cancelled';
      appointment.cancellationReason = refundReason;
      await appointment.save({ session });
  
      // Commit transaction
      await session.commitTransaction();
  
      // Send notification (async)
      sendRefundNotification(appointment.userId, refundRequest._id, netAmount).catch(console.error);
  
      // Send response
      res.status(200).json({
        success: true,
        message: 'Appointment cancelled and refund requested successfully',
        data: {
          refundRequest: {
            id: refundRequest._id,
            amount: refundRequest.amount,
            processingFee: refundRequest.processingFee,
            netAmount: refundRequest.netAmount,
            status: refundRequest.status
          }
        }
      });
  
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error('[REFUND_ERROR]', {
        error: error.message,
        stack: error.stack,
        time: new Date().toISOString(),
        endpoint: '/cancel-with-refund',
        referenceId: uuidv4()
      });
      res.status(500).json({
        success: false,
        message: 'Failed to process cancellation with refund'
      });
    } finally {
      session.endSession();
    }
  };









  export const getRefundRequests = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      // Fetch all refund requests, populate appointmentId without filtering
      const requests = await RefundRequest.find()
        .populate({
          path: 'appointmentId',
          select: 'appointmentDate appointmentTime status', // Include status for display
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
  
      // No need to filter since we want all requests
      const total = await RefundRequest.countDocuments();
  
      res.status(200).json({
        success: true,
        count: requests.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        data: requests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch refund requests',
        error: error.message,
      });
    }
  };
  
  export const updateRefundStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!['approved', 'rejected', 'processed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value',
        });
      }
  
      const refund = await RefundRequest.findById(id);
      if (!refund) {
        return res.status(404).json({
          success: false,
          message: 'Refund request not found',
        });
      }
  
      if (refund.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Can only update pending requests',
        });
      }
  
      refund.status = status;
      if (status === 'processed') {
        refund.processedDate = new Date();
      }
      await refund.save();
  
      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update refund status',
        error: error.message,
      });
    }
  };












export const processRefundRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const request = await RefundRequest.findById(id).populate('appointmentId', 'appointmentDate appointmentTime');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Refund request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Check if appointment date has passed (only for approvals)
    if (status === 'approved' && new Date(request.appointmentId.appointmentDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve refund for past appointments'
      });
    }

    request.status = status;
    request.processedDate = status !== 'pending' ? new Date() : null; // Set processedDate
    request.metadata.processorId = req.user?.id || 'system'; // Optional: Track who processed it
    await request.save();

    res.status(200).json({
      success: true,
      message: `Refund request ${status}`,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process refund request',
      error: error.message
    });
  }
};












export const getVeterinarianAppointments = async (req, res) => {
  console.log('Fetching veterinarian appointments...');
  try {
    // Check if Appointment model is defined
    if (!Appointment) {
      throw new Error('Appointment model not defined');
    }

    const veterinarianAppointments = await Appointment.find({ 
      appointmentType: 'veterinarian', // Changed to 'veterinarian'
      status: 'scheduled'
    })
    .select('userId userName appointmentDate appointmentTime doctorId appointmentFee phoneNo email status')
    .lean();

    console.log('Appointments found:', veterinarianAppointments);
    res.status(200).json(veterinarianAppointments.length ? veterinarianAppointments : []);
  } catch (error) {
    console.error('Error fetching veterinarian appointments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching veterinarian appointments', 
      error: error.message 
    });
  }
};
















export const getGroomerAppointments = async (req, res) => {
  console.log('Fetching groomer appointments...');
  try {
    // Check if Appointment model is defined
    if (!Appointment) {
      throw new Error('Appointment model not defined');
    }

    const groomerAppointments = await Appointment.find({ 
      appointmentType: 'groomer',
      status: 'scheduled'
    })
    .select('userId userName appointmentDate appointmentTime doctorId appointmentFee phoneNo email status') // Added phoneNo, email, status
    .lean();

    console.log('Appointments found:', groomerAppointments);
    res.status(200).json(groomerAppointments.length ? groomerAppointments : []);
  } catch (error) {
    console.error('Error fetching groomer appointments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching groomer appointments', 
      error: error.message 
    });
  }
};








export const getTrainerAppointments = async (req, res) => {
  console.log('Fetching trainer appointments...');
  try {
    // Check if Appointment model is defined
    if (!Appointment) {
      throw new Error('Appointment model not defined');
    }

    const trainerAppointments = await Appointment.find({ 
      appointmentType: 'trainer', // Changed to 'trainer'
      status: 'scheduled'
    })
    .select('userId userName appointmentDate appointmentTime doctorId appointmentFee phoneNo email status')
    .lean();

    console.log('Appointments found:', trainerAppointments);
    res.status(200).json(trainerAppointments.length ? trainerAppointments : []);
  } catch (error) {
    console.error('Error fetching trainer appointments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching trainer appointments', 
      error: error.message 
    });
  }
};











export const getAllCancelledAppointments = async (req, res) => {
  console.log('Fetching all cancelled appointments...');
  try {
    // Check if Appointment model is defined
    if (!Appointment) {
      throw new Error('Appointment model not defined');
    }

    const cancelledAppointments = await Appointment.find({ 
      status: 'cancelled' // Filter by status only, no appointmentType restriction
    })
    .select('userId userName appointmentDate appointmentTime doctorId appointmentFee phoneNo email status')
    .lean();

    console.log('Appointments found:', cancelledAppointments);
    res.status(200).json(cancelledAppointments.length ? cancelledAppointments : []);
  } catch (error) {
    console.error('Error fetching all cancelled appointments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching all cancelled appointments', 
      error: error.message 
    });
  }
};













export const createAvlReqAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      professionalType,
      appointmentDate,
      startTime,
      endTime,
      chargePerAppointment,
      specialNotes
    } = req.body;

    // Validate required fields
    if (!doctorId || !professionalType || !appointmentDate || !startTime || !endTime || !chargePerAppointment) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Create new appointment
    const newAppointment = new AppointmentTemp({
      doctorId,
      professionalType,
      appointmentDate,
      startTime,
      endTime,
      chargePerAppointment,
      specialNotes
    });

    // Save to database
    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      data: savedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Server error while creating appointment' });
  }
};



















export const getVeterinarianAppointmentsRequest = async (req, res) => {
  try {
    // Get query parameters for filtering (optional)
    const { date, doctorId, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = { professionalType: 'vet' };
    
    // Add optional filters
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }
    if (doctorId) {
      query.doctorId = doctorId;
    }

    // Fetch with pagination and sorting
    const vetAvailabilities = await AppointmentTemp
      .find(query)
      .sort({ appointmentDate: 1, startTime: 1 }) // Sort by date and time
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await AppointmentTemp.countDocuments(query);

    res.status(200).json({
      message: 'Veterinarian availabilities retrieved successfully',
      data: vetAvailabilities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching veterinarian availabilities:', error);
    res.status(500).json({ 
      error: 'Server error while fetching veterinarian availabilities',
      details: error.message 
    });
  }
};














export const getGroomerAppointmentsRequest = async (req, res) => {
  try {
    const { date, doctorId, page = 1, limit = 10 } = req.query;
    const query = { professionalType: 'groomer' }; // Changed to 'groomer'
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const groomerAvailabilities = await AppointmentTemp
      .find(query)
      .sort({ appointmentDate: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AppointmentTemp.countDocuments(query);

    res.status(200).json({
      message: 'Groomer availabilities retrieved successfully',
      data: groomerAvailabilities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching groomer availabilities:', error);
    res.status(500).json({ 
      error: 'Server error while fetching groomer availabilities',
      details: error.message 
    });
  }
};












export const getPetTrainerAppointmentsRequest = async (req, res) => {
  try {
    const { date, doctorId, page = 1, limit = 10 } = req.query;
    const query = { professionalType: 'pet-trainer' }; // Changed to 'pet-trainer'
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const trainerAvailabilities = await AppointmentTemp
      .find(query)
      .sort({ appointmentDate: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AppointmentTemp.countDocuments(query);

    res.status(200).json({
      message: 'Pet trainer availabilities retrieved successfully',
      data: trainerAvailabilities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pet trainer availabilities:', error);
    res.status(500).json({ 
      error: 'Server error while fetching pet trainer availabilities',
      details: error.message 
    });
  }
};












export const denyAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the appointment exists
    const appointment = await AppointmentTemp.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Delete the appointment
    await AppointmentTemp.findByIdAndDelete(id);

    res.status(200).json({ 
      message: 'Appointment denied and deleted successfully',
      id: id
    });
  } catch (error) {
    console.error('Error denying appointment:', error);
    res.status(500).json({ 
      error: 'Server error while denying appointment',
      details: error.message 
    });
  }
};












export const acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the temporary appointment
    const tempAppointment = await AppointmentTemp.findById(id);
    if (!tempAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create a new confirmed appointment
    const confirmedAppointment = new ConfirmAppointmentReq({
      doctorId: tempAppointment.doctorId,
      professionalType: tempAppointment.professionalType,
      appointmentDate: tempAppointment.appointmentDate,
      startTime: tempAppointment.startTime,
      endTime: tempAppointment.endTime,
      chargePerAppointment: tempAppointment.chargePerAppointment,
      specialNotes: tempAppointment.specialNotes,
    });

    // Save the confirmed appointment
    await confirmedAppointment.save();

    // Delete the temporary appointment
    await AppointmentTemp.findByIdAndDelete(id);

    res.status(200).json({ 
      message: 'Appointment accepted and moved to confirmed requests',
      confirmedAppointment: confirmedAppointment
    });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ 
      error: 'Server error while accepting appointment',
      details: error.message 
    });
  }
};

