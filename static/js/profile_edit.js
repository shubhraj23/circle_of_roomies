/*
profile_edit.js

This file contains the vanillaJs for making the /profile/edit page more responsive and make functions on the website look more good.
*/

// Adding the on-click event listener to the edit-btn
try {
	document.getElementById("edit-btn").addEventListener("click", (event) => {
		// Preventing the default action
		event.preventDefault();

		// Getting the user input if there are any updates
		if (/^[a-zA-z]{6,40}/.test(document.getElementById("edit-name-input").value)) {
			// If the name entry validates
			// Sending the HTTP POST request
			fetch("/profile/edit", {
				method: "POST",
				body: JSON.stringify({
					name: document.getElementById("edit-name-input").value,
					city: document.getElementById("edit-city-input").value,
					state: document.getElementById("edit-state-input").value,
					social: document.getElementById("edit-social-input").value,
					bio: document.getElementById("edit-bio-input").value,
				}),
				headers: { "Content-type": "application/json; charset=UTF-8" },
			}).then(response => {
				// Dispalying the resposne via the alert
				response.text().then(response => {
					alert(response);
				});
			}).catch(error => {
				// Displaying the error via the alert
				alert(error);
			});
		} else {
			// If the user entered name doesn't validates
			alert("Please enter an appropriate name!");
		}
	});
} catch(error) {
	// Displaying the error via the alert
	alert(error);
}