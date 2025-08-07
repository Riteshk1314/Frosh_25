const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	isLive: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		required: true,
		default: "<NONE>",
	},
	mode: {
		type: String,
		enum: ["offline", "online"],
		required: true,
	},
	location: {
		type: String,
		validate: {
			validator(val) {
				return this.mode !== "offline" || !!val;
			},
			message: "Location is required for offline events",
		},
	},
	slots: {
		type: Number,
		required: true,
		default: 1,
	},

	startTime: {
		type: String,
		required: true,
	},

	totalSeats: {
		type: Number,
		required: true,
		default: 0,
		validate: {
			validator(val) {
				return val >= 0;
			},
			message: "Total Seats must NOT be negative number",
		},
	},
	eventDescription: {
		type: String,
		default: "",
	},
	registrationCount: {
		type: Number,
		default: 0,
	},
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
