const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
	
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	passStatus: {	
		type: String,
		enum: ["active", "expired"],
		default: "active",
	},
	isScanned: {
		type: Boolean,
		default: false,
	},
	timeScanned: {
		type: Date,
		default: null,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;