/*
basic.js

This JS file contains the required javascript functionalities required on the frontend side. These are:
1. Encrypter
*/

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