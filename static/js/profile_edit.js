/*
profile_edit.js

This file contains the vanillaJs for making the /profile/edit page more responsive and make functions on the website look more good.
*/

// Adding the on-click event listener to the edit-profile-btn
try {
	document.getElementById("edit-profile-btn").addEventListener("click", (event) => {
		// Preventing the default action
		event.preventDefault();

		// Checking if the values are actually original values
		if ((document.getElementById("edit-name-input").value == original_name) && (document.getElementById("edit-city-input").value == original_city) && (document.getElementById("edit-state-input").value == original_state) && (document.getElementById("edit-social-input").value == original_social) && (document.getElementById("edit-bio-input").value == original_bio) && (/^[a-zA-Z0-9]{1,350}/.test(document.getElementById("edit-bio-input").value))) {
			return null;
		} else {

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
		}
	});
} catch(error) {
	// Displaying the error via the alert
	alert(error);
}

// Adding the on-click event listener to the edit-pfp-btn
try {
	document.getElementById("edit-pfp-btn").addEventListener("click", (event) => {
		// Prevent the default action
		event.preventDefault();

		// Getting the file details from the user input
		const data = new FormData();
		data.append("pfp", document.getElementById("edit-pfp-input").files[0]);

		// Sending the HTTP POST request
		fetch("/profile/pfp", {
			method: "POST",
			body: data,
		}).then(response => {
			if (response.ok) {
				return response.text();
			} else {
				// If there occurs an error
				alert("Failed to update the profile picture!");
				window.location.reload();
			}
		}).then(response => {
			alert(response);
			window.location.reload();
		}).catch(error => alert(error));
	});
} catch(error) {
	// Displaying the error via the alert
	alert(error);
}