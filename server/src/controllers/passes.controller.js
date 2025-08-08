const asyncHandler = require("express-async-handler");
const express = require("express");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const User = require("../models/users.model.js");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const qs = require('qs');


const bookTicket = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    // Input validation with early returns
    const { eventId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        error: "User ID and Event ID are required"
      });
    }

    // Validate ObjectId format early
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format"
      });
    }

    // Start transaction for atomic operations
    session.startTransaction();

    // Use findOneAndUpdate for atomic seat booking with optimistic locking
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $gt: ["$totalSeats", "$registrationCount"] } // Ensure seats available
      },
      {
        $inc: { registrationCount: 1 } // Atomically increment
      },
      {
        new: true,
        session,
        runValidators: true
      }
    );

    if (!event) {
      await session.abortTransaction();
      
      // Check if event exists or just no seats
      const eventExists = await Event.findById(eventId).select('_id totalSeats registrationCount');
      if (!eventExists) {
        return res.status(404).json({
          success: false,
          error: "Event not found"
        });
      }
      
      return res.status(409).json({
        success: false,
        error: "No tickets available - event is fully booked",
        availableSeats: Math.max(0, eventExists.totalSeats - eventExists.registrationCount)
      });
    }

    // Check for existing active pass with database-level constraint
    const existingPass = await Pass.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      eventId: new mongoose.Types.ObjectId(eventId),
      passStatus: "active"
    }).session(session);

    if (existingPass) {
      // Rollback the seat increment
      await Event.findByIdAndUpdate(
        eventId,
        { $inc: { registrationCount: -1 } },
        { session }
      );
      
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        error: "You already have an active ticket for this event",
        existingPassId: existingPass._id
      });
    }

    // Create the pass
    const pass = new Pass({
      userId: new mongoose.Types.ObjectId(userId),
      eventId: new mongoose.Types.ObjectId(eventId),
      passStatus: "active",
      isScanned: false,
      timeScanned: null,
      createdAt: new Date(),
    });

    await pass.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Return success response with minimal data
    res.status(201).json({
      success: true,
      message: "Ticket booked successfully",
      data: {
        passId: pass._id,
        eventId: event._id,
        eventName: event.name,
        eventStartTime: event.startTime,
        eventLocation: event.location,
        eventMode: event.mode,
        passStatus: pass.passStatus,
        createdAt: pass.createdAt,
        remainingSeats: event.totalSeats - event.registrationCount
      }
    });

  } catch (error) {
    // Always abort transaction on error
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error('Ticket booking error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.userId,
      eventId: req.body?.eventId,
      timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Invalid data provided",
        details: Object.keys(error.errors).map(key => error.errors[key].message)
      });
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate booking detected"
      });
    }

    // Network/timeout errors
    if (error.name === 'MongoNetworkError' || error.code === 'ECONNRESET') {
      return res.status(503).json({
        success: false,
        error: "Service temporarily unavailable. Please try again."
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: "Failed to book ticket. Please try again.",
      requestId: req.headers['x-request-id'] || Date.now()
    });

  } finally {
    // Always end the session
    await session.endSession();
  }
};

const getPassByUUID = async (req, res) => {
  try {
    const passUUID = req.params.passUUID;
    if (!passUUID) {
      return res.status(400).json({ error: "Pass UUID is required" });
    }

    const pass = await Pass.findOne({ passUUID: passUUID })
      .populate('userId', 'name')
      .populate('eventId', 'name startDate')
      .select('eventId userId paymentStatus createdAt amount friends passUUID passType');

    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    const totalAmount = pass.amount

    const responseData = {
      passAmount: totalAmount,
      passEventName: pass.eventId?.name || "Unknown Event",
      passEventDate: pass.eventId?.startDate || "Unknown Date",
      passPaymentStatus: pass.paymentStatus || "ERROR",
      passCreatedAt: pass.createdAt || "NO",
      passStatus: pass.paymentStatus || "ERROR",
      passEnteries: pass.friends.length + 1, // Including the main userP
      eventId: pass.eventId?._id || "Unknown Event ID",
      // Additional fields that might be useful
    };

    return res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get pass by UUID error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPassByUserAndEvent = async (req, res) => {
  try {
     const { eventId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        error: "User ID and Event ID are required"
      });
    }
    console.log("Fetching passes for user:", userId, "and event:", eventId);
    const pass = await Pass.findOne({
      userId: userId,
      eventId: eventId,
    })
    console.log("Found passes:", pass);
    if (!pass|| pass.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "No passes found for this user and event" 
      });
    }

    // // Map through all passes to create the response array
    // const passesData = passes.map(pass => {
    //   return {
    //     passId: pass._id,
    //     userId: pass.userId,
    //     eventId: pass.eventId._id,
    //     eventName: pass.eventId.name,
    //     eventStartTime: pass.eventId.startTime,
    //     eventLocation: pass.eventId.location,
    //     eventMode: pass.eventId.mode,
    //     passStatus: pass.passStatus,
    //     isScanned: pass.isScanned,
    //     timeScanned: pass.timeScanned,
    //     createdAt: pass.createdAt,
    //     userEmail: req.user.email
    //   };
    // });

    // console.log("Passes found:", passesData.length);

    return res.status(200).json({
      success: true,
      message: "Passes found successfully",
      pass,
    });
  } catch (error) {
    console.error('Get passes error:', error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: error.message 
    });
  }
};
const getPassByQrStringsAndPassUUID = async (req, res) => {
  try {
    const pass = await Pass.findOne({
      passUUID: req.body.passUUID,
    })

    console.log(req.body.qrId)
    console.log(pass)

    if (!pass) {
      return res.status(404).json({ error: "Valid pass not found" });
    }

    let person = null;

    // Check if qrStrings exists and is an array
    if (pass.qrStrings && Array.isArray(pass.qrStrings)) {
      // Use for...of loop to iterate over the actual objects
      for (const qr of pass.qrStrings) {
        if (qr._id && qr._id.toString() === req.body.qrId) {
          console.log("QR found", qr)
          person = qr;
          break;
        }
      }
    }

    console.log("Found person:", person)

    return res.status(200).json({
      success: true,
      data: {
        buyer: pass.userId,
        event: pass.eventId,
        person,
        amount: pass.amount,
      },
    });

  } catch (error) {
    console.error('Get pass by UUID error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
const Accept = async (req, res) => {
  try {
    let passUUID = req.body.uuid;
    if (!passUUID) {
      return res.status(400).json({ error: "Pass UUID is required" });
    }
    let qrId = req.body.qrId;
    if (!qrId) {
      return res.status(400).json({ error: "QR ID is required" });
    }

    // Find pass by passUUID field, not by _id
    const pass = await Pass.findOne({ passUUID });
    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    // Find the QR string by _id
    const qrString = pass.qrStrings.find(qr => qr._id.toString() === qrId);
    if (!qrString) {
      return res.status(404).json({ error: "QR code not found" });
    }

    if (qrString.isScanned) {
      return res.status(400).json({ error: "QR code already scanned" });
    }

    qrString.scannedAt = new Date();
    qrString.qrScanned = true;
    await pass.save();
    return res.status(200).json({ message: "Pass scanned successfully" });
  }
  catch (error) {
    console.error('Accept pass error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const Reject = async (req, res) => {
//   try{
//   let passUUID= req.params.uuid;
//   if (!passUUID) {
//     return res.status(400).json({ error: "Pass UUID is required" });
//   }
//   qrId = req.params.qrId;
//   if (!qrId) {
//     return res.status(400).json({ error: "QR ID is required" });
//   }
//     const pass = await Pass.findById(uuid);
//     if (!pass) {
//       return res.status(404).json({ error: "Pass not found" });
//     }
//     const qrString = pass.qrStrings.find(qr => qr.id === qrId);
//     if (!qrString) {
//       return res.status(404).json({ error: "QR code not found" });
//     }
//     if (qrString.isScanned) {
//       return res.status(400).json({ error: "QR code already scanned" });
//     }
//     qrString.isScanned = ;
//     qrString.scannedAt = new Date();
//     await pass.save();
//     return res.status(200).json({ message: "Pass scanned successfully" });
//   }
//   catch (error) {
//     console.error('Accept pass error:', error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


const canScan = async (req, res) => {
  let user = req.user;
  let eventId = req.body.eventId;
  const event = await Event.findById(eventId);
  if (user.role !== 'admin' && user.role !== 'event_manager') {
    return res.status(403).json({ error: "Forbidden: Invalid role" });
  }
  try {
    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Invalid role" });
    }
    return res.status(200).json({ message: "User can scan passes" });

  }
  catch (error) {
    console.error('Get pass error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getPassByUserAndEvent,
  bookTicket,
  canScan,
  Accept,
  getPassByQrStringsAndPassUUID,
  getPassByUUID,
};