/*
Models.js

This JS file defines the model schemas for the MongoDB collections for storing the user data, and also perform several experiments on them (inserting, editing, deleting).

Author: Rishav Das (github.com/r1shavd/)
*/

// Importing the required modules
const Mongoose = require("mongoose");

// Creating the "Users" schema
const UsersSchema = Mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate: {
			validator: (value) => 	(/^[a-zA-Z ]{6,40}/.test(value)),
			message: () => "Invalid name input!",
		},
	},
	password: {
		type: String,
		required: true,
		validate: {
			validator: (value) => (value.length >= 8),
			message: () => "Please choose a strong password",
		},
	},
	bio: { type: String, required: false },
	email: {
		type: String,
		required: true,
		validate: {
			validator: (value) => (/^[a-zA-Z0-9.!#$%&'i*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)),
			message: () => "Invalid email input!",
		},
	},
	addr: {	type: String, default: "Anonymous" },
	insta_username: { type: String, default: "" },
	created_on: { type: Date, default: Date.now },
});
const Users = Mongoose.model("User", UsersSchema);

// Creating the "UserLogs" schema
const UserLogsSchema = Mongoose.Schema({
	user_id: { type: String, required: true },
	ip_addr: { type: String, default: "" },
	login_time: { type: Date, default: Date.now },
});
const UserLogs = Mongoose.model("UserLog", UserLogsSchema);

// Creating the "ContactRequests" schema
const ContactRequestsSchema = Mongoose.Schema({
	name: { type: String, default: "Anonymous" },
	ip_addr: { type: String, default: "" },
	msg: { type: String, required: true },
	sent_at: { type: Date, default: Date.now },
});
const ContactRequests = Mongoose.model("ContactRequest", ContactRequestsSchema);

// Creating the "Ratings" schema
const RatingsSchema = Mongoose.Schema( {
	user_id: { type: String, required: true },
	score: {
		type: Number,
		required: true,
		validate: {
			validator: (value) => (score < 0 && score > 5),
			message: () => "Please enter an appropriate rating score (1-5).",
		},
	},
	desc: { type: String, default: "" },
	sent_at: { type: Date, default: Date.now },
});
const Ratings = Mongoose.model("Rating", RatingsSchema);

module.exports = { Users, UserLogs, ContactRequests, Ratings };
