/*
login.ejs

This file contains the VanillaJS frontend scripts that are required for the proper responsiveness and effective working of the different funcitonalities of the login page of the web app.

Author: Rishav Das (github.com/r1shavd/)
*/

// Adding the onclick event listener to the login button on the form
try {
	document.getElementById("login-btn").addEventListener("click", () => {
		// Getting the user entered values
		const email = document.getElementById("login-email-input").value;
		const password = document.getElementById("login-password-input").value;

		// Validating the user entered values
		if (/^[a-zA-Z0-9.!#$%&'i*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
			// If the email entered is in valid format
			if ((password.length >= 8) && (!password.includes(' '))) {
				// If the password length is appropriate and doesn't contains whitespace, then we proceed

				// Sending the HTTP POST request
				fetch("/login", {
					method: "POST",
					body: JSON.stringify({
						task: "signin",
						email: email,
						password: password,
					}),
					headers: { "Content-type": "application/json; charset=UTF-8" },
				}).then(response => {
					// Dispalying the resposne via the alert
					if (response.ok) {
						response.text().then(response => {
							alert(response);
							window.location.reload();
						})
					} else {
						alert("Server failure!");
						window.location.reload();
					}
				}).catch(error => {
					// Displaying the error via the alert
					alert(error);
				});
			} else {
				// If the user entered password doesn't validates
				alert("Please enter an appropriate password!");
			}
		} else {
			// If the user entered email doesn't validates
			alert("Please enter an appropriate email address!");
		}
	});
} catch(error) {
	// Displaying the error via the alert
	alert(error);
}

// Adding the onclick event listener to the signup button on the form
try {
	document.getElementById("signup-btn").addEventListener("click", () => {
		// Getting the user entered values
		const name = document.getElementById("signup-name-input").value;
		const email = document.getElementById("signup-email-input").value;
		const password = document.getElementById("signup-password-input").value;

		// Validating the user entered values
		if (/^[a-zA-Z ]{6,40}/.test(name)) {
			// If the name entered is in valid format
			if (/^[a-zA-Z0-9.!#$%&'i*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
				// If the email entered is in valid format
				if ((password.length >= 8) && (!password.includes(' '))) {
					// If the password length is appropriate and doesn't contains whitespace, then we proceed
					if (password == document.getElementById("signup-confirm-password-input").value) {
						// If the password entered matches with confirm password input
			
						// Sending the HTTP POST request
						fetch("/login", {
							method: "POST",
							body: JSON.stringify({
								task: "signup",
								name: name,
								email: email,
								password: password,
							}),
							headers: { "Content-type": "application/json; charset=UTF-8" },
						}).then(response => {
							// Dispalying the resposne via the alert
							if (response.ok) {
								response.text().then(response => {
									alert(response);
									window.location.reload();
								});
							} else {
								alert("Server failure!");
								window.location.reload();
							}
						}).catch(error => {
							// Displaying the error via the alert
							alert(error);
						});
					} else {
						// If the user entered password doesn't matches with confirm password
						alert("Password and confirm password entry do not match!");
					}
				} else {
					// If the user entered password doesn't validates
					alert("Please enter an appropriate password!");
				}
			} else {
				// If the user entered email doesn't validates
				alert("Please enter an appropriate email address!");
			}
		} else {
			// If the user entered name doesn't validates
			alert("Please enter an appropriate name!");
		}
	});
} catch(error) {
	// Displaying the error via the alert
	alert(error);
}