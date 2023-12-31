/*
DbConfig.js

This JS source file contains the functions and objects for connecting the express.js app to the sqlite3 db.

Author: Rishav Das (github.com/r1shavd/)
*/

/*
TABLE SCHEMAS:

1. Users {
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL,
	pfp VARCHAR(100) DEFAULT "",
	bio TEXT,
	email VARCHAR(100) UNIQUE NOT NULL,
	city VARCHAR(50) NOT NULL,
	state VARCHAR(50) NOT NULL,
	social_link VARCHAR(100),
	created_on DATE DEFAULT CURRENT_TIMESTAMP
},

2. Ratings {
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER UNIQUE NOT NULL,
	score INTEGER NOT NULL,
	content TEXT,
	created_on DATE DEFAULT CURRENT_TIMESTAMP,
}

3. ContactRequests {
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(50),
	content TEXT,
	created_on DATE DEFAULT CURRENT_TIMESTAMP,
}
*/
