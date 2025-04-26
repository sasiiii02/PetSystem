import mongoose from "mongoose";
import Stripe from "stripe";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import EventNotification from "../models/EventNotification.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/registrations/:id/register
export const createRegistrationSession = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user || !req.user.userId) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: "User authentication required" });
    }
    const userId = req.user.userId;
    const { id } = req.params;
    const { tickets } = req.body;

    if (!tickets || !Number.isInteger(tickets) || tickets < 1) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid number of tickets" });
    }

    const event = await Event.findById(id).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    if (event.status.toLowerCase() !== "active") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Event is not active", eventStatus: event.status });
    }

    const availableTickets = event.maxAttendees - event.registeredTickets;
    if (tickets > availableTickets) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Only ${availableTickets} tickets available` });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newRegistration = new Registration({
      eventId: id,
      userId,
      name: user.name,
      email: user.email,
      tickets,
      paymentStatus: "pending",
      originalTickets: tickets,
    });
    await newRegistration.save({ session });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const successUrl = `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}&registration_id=${newRegistration._id}&event_id=${id}`;
    const cancelUrl = `${frontendUrl}/cancel?event_id=${id}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${event.title} - Event Ticket`,
              description: `Date: ${new Date(event.date).toDateString()}, Time: ${event.time}`,
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity: tickets,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { registrationId: newRegistration._id.toString() },
    });

    newRegistration.paymentIntentId = checkoutSession.payment_intent;
    await newRegistration.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Proceed to payment",
      checkoutUrl: checkoutSession.url,
      registrationId: newRegistration._id,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  } finally {
    session.endSession();
  }
};

// POST /api/registrations/confirm
export const confirmRegistrationPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sessionId, registrationId } = req.query;
    const userId = req.user.userId;

    if (!sessionId || !sessionId.startsWith("cs_")) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid Stripe session ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid registration ID" });
    }

    const registration = await Registration.findOne({
      _id: registrationId,
      userId,
    }).session(session);
    if (!registration) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registration not found or doesn't belong to user" });
    }

    const event = await Event.findById(registration.eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    let checkoutSession;
    let retries = 3;
    let delay = 1000;
    for (let i = 0; i < retries; i++) {
      try {
        checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent"],
        });
        if (checkoutSession.payment_status === "paid") {
          break;
        } else {
          throw new Error("Payment not completed");
        }
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (checkoutSession.payment_status !== "paid") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const expectedAmount = Math.round(event.price * registration.tickets * 100);
    if (checkoutSession.amount_total !== expectedAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
        details: {
          expected: expectedAmount,
          received: checkoutSession.amount_total,
        },
      });
    }

    registration.paymentStatus = "paid";
    registration.paymentDate = new Date();
    registration.paymentIntentId = checkoutSession.payment_intent.id;
    await registration.save({ session });

    await Event.findByIdAndUpdate(
      registration.eventId,
      { $inc: { registeredTickets: registration.tickets } },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      registration: {
        id: registration._id,
        eventId: registration.eventId,
        tickets: registration.tickets,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Payment Confirmation Error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Payment confirmation failed",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  } finally {
    session.endSession();
  }
};

// PATCH /api/registrations/:id/cancel
export const cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Validate registration
    const registration = await Registration.findById(id).session(session);
    if (!registration || registration.userId.toString() !== userId) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registration not found or unauthorized" });
    }
    if (registration.status !== "active" || registration.paymentStatus !== "paid") {
      console.log("Invalid registration state:", {
        registrationId: id,
        status: registration.status,
        paymentStatus: registration.paymentStatus,
      });
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Registration cannot be cancelled" });
    }

    // Validate event
    const event = await Event.findById(registration.eventId).session(session);
    if (!event || event.status !== "active") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Event not found or not active" });
    }

    // Get refund policy with fallbacks
    const minDays = event.refundPolicy?.minDays ?? parseInt(process.env.REFUND_DAYS_MIN) ?? 2;
    const maxDays = event.refundPolicy?.maxDays ?? parseInt(process.env.REFUND_DAYS_MAX) ?? 7;
    const percentage = event.refundPolicy?.percentage ?? parseInt(process.env.REFUND_PERCENTAGE) ?? 50;

    // Validate refund policy
    if (minDays > maxDays) {
      console.error("Invalid refund policy:", { minDays, maxDays });
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Invalid refund policy configuration" });
    }
    if (percentage < 0 || percentage > 100) {
      console.error("Invalid refund percentage:", { percentage });
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Invalid refund percentage" });
    }

    // Calculate days before event
    const daysBefore = (event.date - new Date()) / (24 * 60 * 60 * 1000);
    let refundAmount = 0;
    let refundStatus = "none";

    console.log("Refund check:", {
      daysBefore,
      minDays,
      maxDays,
      percentage,
      eventPrice: event.price,
      tickets: registration.tickets,
    });

    // Process refund if within refund window
    if (event.price === 0) {
      refundAmount = 0;
      refundStatus = "none";
    } else if (daysBefore >= minDays && daysBefore <= maxDays) {
      refundAmount = event.price * registration.tickets * (percentage / 100);
      if (refundAmount > 0) {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: registration.paymentIntentId,
            amount: Math.round(refundAmount * 100),
          });
          console.log("Refund processed:", refund.id);
          refundStatus = "completed";
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError);
          await session.abortTransaction();
          return res.status(500).json({
            success: false,
            message: "Refund failed",
            error: stripeError.message,
          });
        }
      }
    } else {
      console.log("Outside refund window:", { daysBefore, minDays, maxDays });
    }

    // Update registration
    registration.status = "cancelled";
    registration.cancelledAt = new Date();
    registration.refundStatus = refundStatus;
    registration.refundAmount = refundAmount;
    registration.refundedAt = refundStatus === "completed" ? new Date() : null;

    // Update event ticket count
    event.registeredTickets -= registration.tickets;

    // Create notification
    const notification = new EventNotification({
      eventId: event._id,
      userId,
      content: `Registration cancelled. ${
        refundAmount > 0 ? `Refund of $${refundAmount.toFixed(2)} processed.` : "No refund."
      }`,
      read: false,
    });

    // Save changes
    await registration.save({ session });
    await event.save({ session });
    await notification.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
      refundAmount,
      refundStatus,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Cancellation Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  } finally {
    session.endSession();
  }
};
// PATCH /api/registrations/:id/update-tickets
// PATCH /api/registrations/:id/update-tickets
export const updateRegistrationTickets = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { newTickets } = req.body;
    const userId = req.user.userId;

    if (!Number.isInteger(newTickets) || newTickets <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid ticket count" });
    }

    const registration = await Registration.findById(id).session(session);
    if (!registration || registration.userId.toString() !== userId) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registration not found or unauthorized" });
    }
    if (registration.status !== "active" || registration.paymentStatus !== "paid") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Registration cannot be updated" });
    }

    const event = await Event.findById(registration.eventId).session(session);
    if (!event || event.status !== "active") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Event not found or not active" });
    }

    const delta = newTickets - registration.tickets;
    if (delta === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "No change in ticket count" });
    }

    const availableTickets = event.maxAttendees - event.registeredTickets + registration.tickets;
    if (delta > 0 && delta > availableTickets) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Only ${availableTickets} tickets available` });
    }

    let refundAmount = 0;
    let refundStatus = "none";
    let notificationContent = "";

    if (delta < 0) {
      const daysBefore = (event.date - new Date()) / (24 * 60 * 60 * 1000);
      if (daysBefore >= parseInt(process.env.REFUND_DAYS_MIN) && daysBefore <= parseInt(process.env.REFUND_DAYS_MAX)) {
        refundAmount = event.price * Math.abs(delta) * (parseInt(process.env.REFUND_PERCENTAGE) / 100);
        try {
          await stripe.refunds.create({
            payment_intent: registration.paymentIntentId,
            amount: Math.round(refundAmount * 100),
          });
          refundStatus = "completed";
        } catch (error) {
          await session.abortTransaction();
          return res.status(500).json({ success: false, message: "Refund failed", error: error.message });
        }
      }
      registration.tickets = newTickets;
      registration.updatedAt = new Date();
      registration.refundStatus = refundStatus;
      registration.refundAmount = refundAmount;
      registration.refundedAt = refundStatus === "completed" ? new Date() : null;
      event.registeredTickets += delta;
      notificationContent = `Updated to ${newTickets} tickets. ${refundAmount > 0 ? `Refund of $${refundAmount.toFixed(2)} processed.` : "No refund."}`;
    } else {
      const amount = event.price * delta;
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const successUrl = `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}&registration_id=${registration._id}&event_id=${event._id}&update=true`; // Updated
      const cancelUrl = `${frontendUrl}/my-events`;

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: event.title },
              unit_amount: Math.round(event.price * 100),
            },
            quantity: delta,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { registrationId: id, newTickets: newTickets.toString() },
      });

      registration.pendingPaymentIntentId = checkoutSession.payment_intent;
      await registration.save({ session });
      await session.commitTransaction();
      return res.status(200).json({
        success: true,
        message: "Proceed to payment",
        checkoutUrl: checkoutSession.url,
      });
    }

    const notification = new EventNotification({
      eventId: event._id,
      userId,
      content: notificationContent,
      read: false,
    });

    await registration.save({ session });
    await event.save({ session });
    await notification.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Tickets updated successfully",
      tickets: newTickets,
      refundAmount,
      refundStatus,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Ticket Update Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  } finally {
    session.endSession();
  }
};

// POST /api/registrations/confirm-update
export const confirmUpdatePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sessionId, registrationId } = req.query;
    const userId = req.user.userId;

    if (!sessionId || !sessionId.startsWith("cs_")) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid Stripe session ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid registration ID" });
    }

    const registration = await Registration.findOne({
      _id: registrationId,
      userId,
      pendingPaymentIntentId: { $exists: true },
    }).session(session);
    if (!registration) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registration not found or no pending payment" });
    }

    const event = await Event.findById(registration.eventId).session(session);
    if (!event || event.status !== "active") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Event not found or not active" });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    if (checkoutSession.payment_status !== "paid") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const newTickets = parseInt(checkoutSession.metadata.newTickets);
    const delta = newTickets - registration.tickets;

    const availableTickets = event.maxAttendees - event.registeredTickets + registration.tickets;
    if (delta <= 0 || delta > availableTickets) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid ticket update" });
    }

    const expectedAmount = Math.round(event.price * delta * 100);
    if (checkoutSession.amount_total !== expectedAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
        details: {
          expected: expectedAmount,
          received: checkoutSession.amount_total,
        },
      });
    }

    registration.tickets = newTickets;
    registration.paymentIntentId = checkoutSession.payment_intent.id;
    registration.pendingPaymentIntentId = null;
    registration.updatedAt = new Date();
    event.registeredTickets += delta;

    const notification = new EventNotification({
      eventId: event._id,
      userId,
      content: `Updated to ${newTickets} tickets. Paid $${(event.price * delta).toFixed(2)}.`,
      read: false,
    });

    await registration.save({ session });
    await event.save({ session });
    await notification.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Tickets updated successfully",
      tickets: newTickets,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Update Payment Confirmation Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  } finally {
    session.endSession();
  }
};

// GET /api/registrations/event/:id
export const getRegistrationsByEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const query = { eventId: id };
    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query).populate("userId", "name email");
    res.status(200).json({ success: true, registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch registrations", error: error.message });
  }
};

// GET /api/registrations/user
export const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .populate("eventId", "title date time location eventImageURL price")
      .sort({ registeredAt: -1 });

    res.status(200).json({ success: true, registrations });
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user registrations", error: error.message });
  }
};