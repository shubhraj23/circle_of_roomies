/*
server.js

This JS file contains the definition of the Express.js powered app, where all the endpoints are defined and the respective HTTP GET as well as HTTP POST requests are served.

Author: Rishav Das (github.com/r1shavd/)
*/

// Importing the required modules
const Express = require("express");
const ExpressSession = require("express-session");
const BodyParser = require("body-parser");

// Importing the DB related modules
const Mongoose = require("mongoose");
const { Users, UserLogs, ContactRequests, Ratings } = require("./Models");

// Creating the Express.js powered app object and configuring it for using EJS rendering as well handling HTTP POST request data well
const App = Express();
App.set("view engine", "ejs");
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());
App.use(ExpressSession({secret: '15265126735vdfghdsf35hgdfhgsdf53624', resave: true, saveUninitialized: true}));
App.use(Express.static("static")); // Configuring the static files (CSS, JS, Media)

// Defining the endpoints
// Defining the HTTP GET request endpoints
//
App.get('/', (request, response) => {
	if (request.session.isLoggedIn) {
		// If the user is logged in
		return response.render("index", { data: {
			user_id: request.session.user_id,
		} });
	} else {
		// If the user isnt logged in
		return response.render("index", { data: {
			user_id: false,
		} });
	}
});
// 
App.get("/login", (request, response) => {
	if (request.session.isLoggedIn) {
		// If the user is logged in
		return response.redirect('/');
	} else {
		// If the user isn't logged in
		return response.render("login");
	}
});
//
App.get("/profile", (request, response) => {
	// Getting the query data
	const profile_id = request.query.id;
	if (profile_id == undefined) {
		// Loading current 24 profiles
		let doc = [];
		return response.render("profile", { data: {
			user_id: request.session.user_id,
			multiple: true,
			profiles: doc,
		} });
	} else {
		// Loading the current specified profile
		let doc = {};
		Users.findOne({ _id : profile_id }).then((data) => {
			if (!data) {
				// If there occurs an error
				return response.status(404);
			} else {
				return response.render("profile", { data: {
					user_id: request.session.user_id,
					multiple: false,
					profile: data,
				}, });
			}
		});
	}
});
//
// Defining the HTTP POST request endpoints
//
App.post('/', async (request, response) => {
	if (request.user.isLoggedIn) {
		// If the user is logged in
		// Checking the task specified
		if (request.body.task == "logout") {
			// Logging out the current user
			request.session.isLoggedIn = false;
			request.session.user_id = null;
			return response.end("User logged out successfully!");
		} else if (request.body.task == "edit-profile") {
			// Saving the user with updated data
			 Users.findByIdAndUpdate(request.session._id, {
			 	 name: request.body.name,
			 	 email: request.body.email,
			  	 bio: request.body.bio,
			 	 addr: reqeust.body.addr,
				 insta_username: request.body.insta_username,
			}, (error, data) => {
				if (error) {
					// If there occurs an error
					return response.end("Failed to update the user information.");
				} else {
					// If there occurs no error
					return response.end("Updated the user information successfully");
				}
			});
		} else if (request.body.task == "delete-profile") {
			// Deleting the user profile as well all the data that are associated with the user
			Users.findByIdAndDelete(request.session.user_id, (error, result) => {
				if (error) {
					// If there occurs an error
					return response.end("Failed to delete the user profile");
				} else {
					UserLogs.deleteMany({ user_id: reqeust.session.user_id, }, (error, result) => {
						if (error) {
							// If there occurs an error
							return response.end("Failed to delete the user data");
						} else {
							// If there occurs no error
							return response.end("User profile and data deleted successfully!");
						}
					});
				}
			});
		} else if (request.body.task == "rate") {
			// Getting the rating details and inserting into the database
			let doc = new Ratings({
				user_id: request.session.user_id,
				score: request.body.score,
				desc: request.body.desc,
			});
			await doc.save().then(() => {
				return response.end("Review added successfully!");
			}).catch((error) => {
				// If there occurs an error
				return response.end(error);
			});
		} else if (request.body.task == "contact-request") {
			// Adding the contact request to the database
			let doc = new ContactRequests({
				name: request.body.name,
				ip_addr: "",
				msg: request.body.msg,
			});
			await doc.save().then(() => {
				return response.end("Message sent successfully!")
			}).catch((error) => {
				// If there occurs an error
				return response.end(error);
			});
		} else {
			return response.end("Task not specified!");
		}
	} else {
		// If the user isn't logged in
		response.status(403)
		return response.end("Forbidden!");
	}
});
//
App.post("/login", async (request, response) => {
	if (request.session.isLoggedIn) {
		// Stating forbidden if user is logged in already
		response.status(403);
		return response.end("Forbidden");
	} else {
		// Checking the task specified
		if (request.body.task == "signup") {
			// Checking if the user with same email exists
			Users.exists({ email: request.body.email, }).then(data => {
				if (data != null) {
					return response.end("User already exists with this email address, use another one or try forget password, if you lost access to your account.");
				} else {
					// Creating the new user
					let doc = new Users({
						name: request.body.name,
						password: Encrypter.Hash(request.body.password),
						email: request.body.email,
						bio: request.body.bio,
						insta_username: request.body.insta_username,
					});
					doc.save().then(() => {
						request.session.isLoggedIn = true;
						request.session.user_id = data._id;
						return response.end("New user created successfully. You can login with the email and password.");
					}).catch((error) => {
						// If there occurs an error
						return response.end(error);
					});
				}
			}).catch((error) => {
				return response.end(error);
			});
		} else if (request.body.task == "signin") {
			// Getting the user information
			Users.findOne({ email: request.body.email, }).then(data => {
				if (data == null) {
					// If the user doesn't exists
					return response.end("No such user exists!");
				} else {
					// Checking if the password hashes match or not
					if (data.password == Encrypter.Hash(request.body.password)) {
						// If the password hashes match
						request.session.isLoggedIn = true;
						request.session.user_id = data._id;
						return response.end("User logged in successfully!");
					} else {
						// If the password hashes match
						return response.end("Incorrect password!");
					}
				}
			});
		} else {
			return response.end("Task not specified");
		}
	}
});
//

// Defining the custom functions and objects that are required
//
const Encrypter = {
	Encrypt: (text, password) => {
		// Generating key for encryption
		let key = 0, isEven = true;
		for (let i of password) {
			(isEven) ? key += i.charCodeAt() : key -= i.charCodeAt();
		}

		// Encrypting the text
		let result = "";
		text.split('').forEach((element, index) => {
			result += String.fromCharCode((element.charCodeAt() + key) % 256);
		});
		return btoa(result);
	},
	Decrypt: (text, password) => {
		// Generating key for encryption
		let key = 0, isEven = true;
		for (let i of password) {
			(isEven) ? key += i.charCodeAt() : key -= i.charCodeAt();
		}

		// Decrypting the text
		text = atob(text);
		let result = "";
		text.split('').forEach((element, index) => {
			if (element.charCodeAt() < key) {
				result += String.fromCharCode((element.charCodeAt() - key + 256) % 256);
			} else {
				result += String.fromCharCode((element.charCodeAt() - key) % 256);
			}
		});
		return result;
	},
	Hash: (password) => {
		// Generating key for hashing
		let key = 0, isEven = true;
		for (let i of password) {
			(isEven) ? key += i.charCodeAt() : key -= i.charCodeAt();
		}

		// Hashing the password
		let result = "";
		password.split('').forEach((element, index) => {
			result += String.fromCharCode((element.charCodeAt() + key) % 256);
		});
		return btoa(result);
	}
}
//

// Connecting the app to the db as well as listening on port 8000
const AppStart = async () => {
	try {
		console.log("[*] Connecting to the remote MongoDB");
		await Mongoose.connect("mongodb+srv://shubham22gcebaids037:shubh4m1sg4y@cluster0.icq0f5r.mongodb.net/circle_of_roomies?retryWrites=true&w=majority");
		App.listen(8000, () => console.log("[#] Listening on port 8000"));
	} catch (error) {
		console.log("[!] ", error);
		process.exit(1);
	}
};
AppStart();
