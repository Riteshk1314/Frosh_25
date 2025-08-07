const router = require("express").Router();
const express = require("express");
const auth = require("../middleware/oauth.js");
const Events = require("./../controllers/event.controller.js");
const Passes = require("./../controllers/passes.controller.js");
const { checkRole } = require("../middleware/role.middleware.js");
router.use((req, res, next) => {
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "frame-src 'self'",
        "worker-src 'self' blob:",
        "form-action 'self'"
    ].join("; ");
    
    res.setHeader('Content-Security-Policy', csp);
    
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
});

// Public Routes (no authentication required)
router.get("/getEvents", Events.getEvents);
router.get("/getEventById/:id", Events.getEventById);

// Protected Routes (authentication required)
router.use(auth.verifyToken);

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
