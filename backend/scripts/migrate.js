import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" }); // Explicitly specify .env path

async function migrate() {
  let session;
  try {
    // Verify environment variables
    console.log("MONGODB_URI:", process.env.MONGODB_URI || "undefined");
    console.log("REFUND_DAYS_MIN:", process.env.REFUND_DAYS_MIN);
    console.log("REFUND_DAYS_MAX:", process.env.REFUND_DAYS_MAX);
    console.log("REFUND_PERCENTAGE:", process.env.REFUND_PERCENTAGE);
    
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB");
    console.log("Database name:", mongoose.connection.name);

    // Start session
    session = await mongoose.startSession();
    session.startTransaction();

    // Step 1: Deduplicate Registrations
    const registrationGroups = await Registration.aggregate([
      {
        $group: {
          _id: { userId: "$userId", eventId: "$eventId" },
          registrations: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]).session(session);

    let duplicateRegistrationCount = 0;
    for (const group of registrationGroups) {
      const registrations = group.registrations;
      // Keep the most recent paid and active registration
      const validRegistration = registrations
        .filter(reg => reg.paymentStatus === "paid" && reg.status === "active")
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))[0];

      if (validRegistration) {
        const idsToDelete = registrations
          .filter(reg => reg._id.toString() !== validRegistration._id.toString())
          .map(reg => reg._id);
        await Registration.deleteMany({ _id: { $in: idsToDelete } }, { session });
        duplicateRegistrationCount += idsToDelete.length;
        console.log(`Deleted ${idsToDelete.length} duplicate registrations for user ${group._id.userId} and event ${group._id.eventId}`);
      } else {
        // Keep the most recent registration if none are paid/active
        const mostRecent = registrations.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))[0];
        const idsToDelete = registrations
          .filter(reg => reg._id.toString() !== mostRecent._id.toString())
          .map(reg => reg._id);
        await Registration.deleteMany({ _id: { $in: idsToDelete } }, { session });
        duplicateRegistrationCount += idsToDelete.length;
        console.log(`Deleted ${idsToDelete.length} invalid duplicate registrations for user ${group._id.userId} and event ${group._id.eventId}`);
      }
    }
    console.log(`Deleted ${duplicateRegistrationCount} duplicate registrations`);

    // Step 2: Migrate Registrations
    const registrations = await Registration.find().session(session);
    let registrationCount = 0;
    for (const reg of registrations) {
      if (reg.migrated) {
        console.log(`Skipping already migrated registration: ${reg._id}`);
        continue;
      }

      let updated = false;

      // Set status if not present
      if (!reg.status) {
        if (reg.paymentStatus === "paid") {
          reg.status = "active";
        } else if (reg.paymentStatus === "failed") {
          reg.status = "cancelled";
        } else {
          continue;
        }
        updated = true;
      }

      // Initialize refund fields
      if (!reg.refundStatus) {
        reg.refundStatus = "none";
        updated = true;
      }
      if (reg.refundAmount === undefined) {
        reg.refundAmount = 0;
        updated = true;
      }

      // Set cancelledAt for cancelled registrations
      if (reg.status === "cancelled" && !reg.cancelledAt && reg.paymentStatus === "failed") {
        reg.cancelledAt = new Date();
        updated = true;
      }

      // Set originalTickets and updatedAt
      if (!reg.originalTickets) {
        reg.originalTickets = reg.tickets;
        updated = true;
      }
      if (!reg.updatedAt) {
        reg.updatedAt = reg.registeredAt;
        updated = true;
      }

      reg.migrated = true;
      if (updated) {
        await reg.save({ session });
        registrationCount++;
      }
    }
    console.log(`Migrated ${registrationCount} registrations`);

    // Step 3: Migrate Events
    const events = await Event.find().session(session);
    let eventCount = 0;
    for (const event of events) {
      if (event.migrated) {
        console.log(`Skipping already migrated event: ${event._id}`);
        continue;
      }

      let updated = false;

      // Set refundPolicy
      if (!event.refundPolicy || !event.refundPolicy.minDays) {
        const minDays = parseInt(process.env.REFUND_DAYS_MIN) || 2;
        const maxDays = parseInt(process.env.REFUND_DAYS_MAX) || 7;
        const percentage = parseInt(process.env.REFUND_PERCENTAGE) || 50;

        if (minDays > maxDays) {
          console.warn(`Invalid refund policy for event ${event._id}: minDays=${minDays} > maxDays=${maxDays}`);
          continue;
        }
        if (percentage < 0 || percentage > 100) {
          console.warn(`Invalid refund percentage for event ${event._id}: percentage=${percentage}`);
          continue;
        }

        event.refundPolicy = { minDays, maxDays, percentage };
        updated = true;
      }

      // Recalculate registeredTickets
      const result = await Registration.aggregate([
        { $match: { eventId: event._id, status: "active", paymentStatus: "paid" } },
        { $group: { _id: null, totalTickets: { $sum: "$tickets" } } },
      ]).session(session);

      const totalTickets = result.length > 0 ? result[0].totalTickets : 0;
      if (event.registeredTickets !== totalTickets) {
        console.warn(`Mismatch for event ${event._id}: registeredTickets=${event.registeredTickets}, actual=${totalTickets}`);
        event.registeredTickets = totalTickets;
        updated = true;
      }

      event.migrated = true;
      if (updated) {
        await event.save({ session });
        eventCount++;
      }
    }
    console.log(`Migrated ${eventCount} events`);

    // Commit transaction
    await session.commitTransaction();
    console.log("Migration completed successfully");
  } catch (error) {
    // Abort transaction on error
    if (session) {
      await session.abortTransaction();
    }
    console.error("Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    if (session) {
      session.endSession();
    }
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrate();