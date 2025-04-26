import mongoose from "mongoose";

const eventNotificationSchema = new mongoose.Schema({
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
  content: {
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model("EventNotification", eventNotificationSchema);