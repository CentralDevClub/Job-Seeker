CREATE TABLE users(
	id serial PRIMARY KEY,
	username VARCHAR(100) UNIQUE NOT NULL,
	email text UNIQUE NOT NULL,
	joined TIMESTAMP NOT NULL
);