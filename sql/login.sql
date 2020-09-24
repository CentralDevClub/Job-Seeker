CREATE TABLE login(
	id serial PRIMARY KEY,
	hash text NOT NULL,
	email text UNIQUE NOT NULL
);