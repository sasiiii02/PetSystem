import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  tickets: { type: Number, required: true, default: 1, min: 1 },
  paymentIntentId: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed"], 
    default: "pending" 
  },
  paymentDate: { type: Date },
  registeredAt: { type: Date, default: Date.now },
  // New fields for cancellation and updates
  status: {
    type: String,
    enum: ["active", "cancelled"],
    default: "active",
  },
  cancelledAt: {
    type: Date,
  },
  refundStatus: {
    type: String,
    enum: ["none", "pending", "completed", "failed"],
    default: "none",
  },
  refundAmount: {
    type: Number,
    default: 0,
  },
  refundedAt: {
    type: Date,
  },
  originalTickets: {
    type: Number,
    min: 1,
  },
  updatedAt: {
    type: Date,
  },
  pendingPaymentIntentId: {
    type: String,
  },
}, { timestamps: true });

// Indexes for efficient queries
registrationSchema.index({ eventId: 1, status: 1 });
registrationSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Registration", registrationSchema);