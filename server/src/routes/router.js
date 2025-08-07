const router = require("express").Router();
const express = require("express");
const Events = require("./../controllers/event.controller.js");
const Passes = require("./../controllers/passes.controller.js");
const { checkRole } = require("../middleware/role.middleware.js");

// Public Routes (no authentication required)
router.get("/health", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Server is running", 
        timestamp: new Date().toISOString() 
    });
});
router.get("/getEvents", Events.getEvents);
router.get("/getEventById/:id", Events.getEventById);


// Pass/Ticket Routes
router.post("/bookTicket", Passes.bookTicket);
router.post("/getPass", Passes.getPassByUserAndEvent);

// Pass Management Routes (UUID based)
router.get('/api/passbyuuid/:passUUID', Passes.getPassByUUID);
router.post('/api/getTix', Passes.getPassByQrStringsAndPassUUID);

// Admin Only Routes
router.use(checkRole(["admin"]));

// Event Management Routes (Admin only)
router.post("/createEvent", Events.createEvent);

// Ticket Scanning Routes (Admin only)
router.post("/canScan", Passes.canScan);
router.post("/accept", Passes.Accept);

module.exports = router;
