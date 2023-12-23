/*
server.js

This JS file contains the definition of the Express.js powered app, where all the endpoints are defined and the respective HTTP GET as well as HTTP POST requests are served.

Author: Rishav Das (github.com/r1shavd/)
*/

// Importing the required modules
const Express = require("express");
const ExpressSession = require("express-session");
const BodyParser = require("body-parser");
const Sqlite3 = require("sqlite3");

// Creating the Express.js powered app object and configuring it for using EJS rendering as well handling HTTP POST request data well
const App = Express();
App.set("view engine", "ejs");
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());
App.use(ExpressSession({secret: '15265126735vdfghdsf35hgdfhgsdf53624', resave: true, saveUninitialized: true}));
App.use(Express.static("static")); // Configuring the static files (CSS, JS, Media)

// Connecting to the databse
const DbConnection = new Sqlite3.Database("database.db", (error) => {
	if (error) {
		// If there occurs an error
		console.log("[!] Failed to connect to the database");
		console.log(error);
	} else {
		console.log("[#] Connected to the database")
	}
});

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
	// Getting the user id if mentioned
	const profile_id = request.query.id;
	if (profile_id) {
		// Loading the data of the particular user
		DbConnection.get("SELECT * FROM Users WHERE id = ?;", [profile_id], (error, row) => {
			if (error) {
				// If there occurs an error
				response.status(500);
				return response.end("Failed to load the profile");
			}
			// Rendering the profile page if the profile data is loaded
			return response.render("profile", { data: row });
		})
	}
});
//
// Defining the HTTP POST request endpoints
//
App.post('/', (request, response) => {
	if (!request.session.isLoggedIn) {
		// If the user isn't logged in
		return response.status(403);
	}

	// Executing as per the task
	if (request.body.task == "rating") {
		// Getting the details of the rating
		const score = request.body.score;
		const content = request.body.score;

		// Saving to the database
		DbConnection.run("INSERT INTO Ratings (user_id, score, content) VALUES (?, ?, ?);", [request.session.user_id, score, content], (error) => {
			if (error) {
				// if there occurs an error
				response.status(500);
				return response.end("Database error!");
			}

			return response.end("Review sent successfully!");
		});
	}

	// If the task is not mentioned
	return response.end("Task not mentioned!");
});
//
App.post("/login", (request, response) => {
	if (request.session.isLoggedIn) {
		return response.status(403);
	}

	// Verifying the user
	DbConnection.get("SELECT * FROM Users WHERE email = ?;", [request.body.email], (error, row) => {
		if (error) {
			// If there occurs an error
			response.status(500);
			return response.end("Database error!");
		}

		if (!row) {
			// If the user doesn't exists
			return response.end("No such user found! Please check the email again.");
		}

		if (row.password == request.body.password) {
			// If the password matches
			request.session.isLoggedIn = true;
			request.session.user_id = row.id;
			return response.end("User logged in successfully");
		}
	});
});
//
App.post("/signup", (request, response) => {
	if (request.session.isLoggedIn) {
		// If the user is already logged in
		return response.status(403);
	}

	// Creating an user account

	// Checking if the an user account with same email already exists
	DbConnection.get("SELECT COUNT(*) FROM Users WHERE email = ?", [request.body.email], (error, row) => {
		if (error) {
			// If there occurs an error
			response.status(500);
			throw error;
			return response.end("Database error!");
		}

		if (row["COUNT(*)"] > 0) {
			// If the user account with same email address already exists
			return response.end("User with the same email address already exists");
		} else {
			// Creating the user entry in the database
			DbConnection.run("INSERT INTO Users (name, password, email, city, state) VALUES (?, ?, ?, ?, ?)", [request.body.name, request.body.password, request.body.email, request.body.city, request.body.state], (error) => {
				if (error) {
					// If there occurs an error
					response.status(500);
					throw error;
					return response.end("Database error!");
				}

				return response.end("Created user account successfully!");
			});
		}
	});
});
//

// Making the app to listen on port 3000
App.listen(3000, () => console.log("[#] Listening on port 3000"));