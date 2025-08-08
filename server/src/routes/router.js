const router = require("express").Router();
const express = require("express");
const Events = require("./../controllers/event.controller.js");
const Passes = require("./../controllers/passes.controller.js");
const auth = require("../middleware/auth.js");
const AuthController = require("./../controllers/auth.controller.js");
const Password = require("../controllers/password.controller.js")
const { checkRole } = require("../middleware/role.middleware.js");
const {
  createEventValidation,
  getEventsValidation,
  getEventByIdValidation,
  bookTicketValidation,
  getPassValidation,
  passUUIDValidation,
  qrPassValidation,
  canScanValidation,
  acceptPassValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require("../middleware/validation.js");

// Public Routes (no authentication required)
router.get("/health", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Server is running", 
        timestamp: new Date().toISOString() 
    });
});

// Authentication Routes
router.post("/login", loginValidation, AuthController.login);
router.post("/forgot-password", forgotPasswordValidation, AuthController.forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, AuthController.resetPassword);
router.post("/refresh-token", AuthController.refreshToken);

// Event Routes (Public)
router.get("/getEvents", getEventsValidation, Events.getEvents);
router.get("/getEventById/:id", getEventByIdValidation, Events.getEventById);
router.post("/api/auth/forgot-password", Password.trigReset)
router.post("/api/auth/reset-password", Password.resetPass)
// Protected Routes (authentication required)
router.use(auth.authMiddleware);

// Logout route (requires authentication)
router.post("/logout", AuthController.logout);

// Pass/Ticket Routes (User level)
router.post("/bookTicket",auth.authMiddleware, bookTicketValidation, Passes.bookTicket);
router.post("/getPass", getPassValidation, Passes.getPassByUserAndEvent);

// Pass Management Routes (UUID based - User level)
router.get('/api/passbyuuid/:passUUID', passUUIDValidation, Passes.getPassByUUID);
router.post('/api/getTix', qrPassValidation, Passes.getPassByQrStringsAndPassUUID);

// Admin Only Routes
router.use(checkRole(["admin"]));

// Event Management Routes (Admin only)
router.post("/createEvent", createEventValidation, Events.createEvent);

// Ticket Scanning Routes (Admin only)
router.get("/canScan", Passes.canScan);
router.post("/editEvent", Events.updateEventById)
router.post("/Accept", acceptPassValidation, Passes.Accept);

module.exports = router;
