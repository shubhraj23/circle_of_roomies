/*
search.js

This VanillaJs file defines the several functionalities of the /search page of the app. Currently this file serves the following functionalities:
1. Takes the input of search keyword from the user and sends the HTTP GET request to the server
2. Renders the items fetched from the server on the page
*/

// Adding the onclick event listener to the search-btn
try {
	document.getElementById("search-btn").addEventListener("click", (event) => {
		// Preventing the default onclick action
		event.preventDefault();

		// Sending the HTTP GET request
		fetch(`/search?q=${document.querySelector("input[name='q']").value.split(' ').join('+')}`, {
			method: "GET",
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				// If there occurs an error
				alert("Failed to fetch the data!");
			}
		}).then(response => {
			let result = `<section class="text-gray-600 body-font"><div class="container px-5 py-24 mx-auto"><div class="flex flex-wrap -m-4">`;
			if (response.results.length == 0) {
				// If there are no search results fetched
				result += `<h1 class="text-lg text-gray-900 font-large title-font mb-4">No search results for <b>${document.querySelector("input[name='q']").value}</b></h1>`;
			} else {
				// Iterating through each response and creating the HTML card out of them
				response.results.forEach((element) => {
					result += `<div class="xl:w-1/4 md:w-1/2 p-4" id="profileid-${element.id}"><div class="bg-yellow-200 p-6 rounded-lg">`;
	        if (element.pfp) {
	        	result += `<img class="h-40 rounded w-full object-cover object-center mb-6" src="/media/pfp/${element.pfp}" alt="pfp">`;
	        } else {
	        	result += `<img class="h-40 rounded w-full object-cover object-center mb-6" src="/media/blank_pfp.jpg" alt="pfp">`;
	        }
	       	result += `<h2 class="text-lg text-gray-900 font-medium title-font mb-4">${element.name}</h2><p class="leading-relaxed text-base">${element.city}, ${element.state}</p></div></div>`
				});
			}

			// Replacing the content of the #search-results div with the updated content
			result += '</div></div></section>';
			document.getElementById("search-results").innerHTML = result;
		});
	}).catch(error => alert(error));
} catch(error) {
	// If there occurs an error
	// pass
}