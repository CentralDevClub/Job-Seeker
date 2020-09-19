CREATE TABLE companies(
	id serial PRIMARY KEY,
	name VARCHAR(100) UNIQUE NOT NULL,
	email text UNIQUE NOT NULL,
	description text NOT NULL,
	goal text NOT NULL,
	address text NOT NULL,
	website VARCHAR(100) NOT NULL,
	joined TIMESTAMP NOT NULL
);