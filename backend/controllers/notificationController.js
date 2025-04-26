import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import EventNotification from "../models/EventNotification.js";

// POST /api/notifications/event/:id/send
export const sendEventNotification = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Notification content is required" });
    }

    const event = await Event.findById(id).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const registrations = await Registration.find({ eventId: id, status: "active", paymentStatus: "paid" }).session(session);
    if (!registrations || registrations.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "No active users registered for this event" });
    }

    // Deduplicate userIds
    const uniqueUserIds = [...new Set(registrations.map(reg => reg.userId.toString()))];
    const notifications = uniqueUserIds.map(userId => ({
      eventId: id,
      userId,
      content: content.trim(),
      read: false,
    }));

    await EventNotification.insertMany(notifications, { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Notifications sent successfully" });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error sending event notifications:", err);
    res.status(500).json({ success: false, message: "Server error while sending notifications" });
  } finally {
    session.endSession();
  }
};

// GET /api/notifications/event/:id
export const getEventNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await EventNotification.find({ eventId: id })
      .populate("eventId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching event notifications:", err);
    res.status(500).json({ success: false, message: "Server error while fetching notifications" });
  }
};

// GET /api/notifications/user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const notifications = await EventNotification.find({ userId })
      .populate("eventId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ success: false, message: "Server error while fetching user notifications" });
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const notification = await EventNotification.findOne({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found or not authorized" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ success: false, message: "Server error while marking notification as read" });
  }
};