const asyncHandler = require("express-async-handler");
const express = require("express");
const auth = require("../middleware/oauth.js");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const User = require("../models/users.model.js");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const qs = require('qs');
const { listeners } = require("../models/registration.model.js");
const bookTicket = async (req, res) => {
  try {
    console.log('Booking ticket request:', req.body);

    // Validation
    if (!req.user?._id || !req.body.eventId) {
      return res.status(400).json({
        success: false,
        error: "User ID and Event ID are required"
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found"
      });
    }

    // Check if user already has a pass for this event
    const existingPass = await Pass.findOne({
      userId: req.user._id,
      eventId: req.body.eventId,
      passStatus: "active"
    });

    if (existingPass) {
      return res.status(400).json({
        success: false,
        error: "You already have a ticket for this event"
      });
    }

    // Check available seats
    const availableSeats = event.totalSeats - event.registrationCount;
    if (availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        error: "No tickets available for this event"
      });
    }

    // Create pass
    const pass = new Pass({
      userId: req.user._id,
      eventId: req.body.eventId,
      passStatus: "active",
      isScanned: false,
      timeScanned: null,
      createdAt: new Date(),
    });

    await pass.save();

    // Update event registration count
    await Event.findByIdAndUpdate(
      req.body.eventId,
      { $inc: { registrationCount: 1 } }
    );

    console.log('Pass created with ID:', pass._id);

    return res.status(200).json({
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
        createdAt: pass.createdAt
      }
    });

  } catch (error) {
    console.error('Ticket booking error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to book ticket",
      message: error.message,
    });
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
    
    if (!req.user?._id || !eventId) {
      return res.status(400).json({
        success: false,
        error: "User ID and Event ID are required"
      });
    }

    const passes = await Pass.find({
      userId: req.user._id,
      eventId: eventId,
      passStatus: "active"
    }).populate('eventId', 'name startTime location mode');

    if (!passes || passes.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "No passes found for this user and event" 
      });
    }

    // Map through all passes to create the response array
    const passesData = passes.map(pass => {
      return {
        passId: pass._id,
        userId: pass.userId,
        eventId: pass.eventId._id,
        eventName: pass.eventId.name,
        eventStartTime: pass.eventId.startTime,
        eventLocation: pass.eventId.location,
        eventMode: pass.eventId.mode,
        passStatus: pass.passStatus,
        isScanned: pass.isScanned,
        timeScanned: pass.timeScanned,
        createdAt: pass.createdAt,
        userEmail: req.user.email
      };
    });

    console.log("Passes found:", passesData.length);

    return res.status(200).json({
      success: true,
      message: "Passes found successfully",
      data: {
        passes: passesData,
        count: passesData.length
      }
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