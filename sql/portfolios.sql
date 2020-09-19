CREATE TABLE portfolios(
	id serial PRIMARY KEY,
	email text UNIQUE NOT NULL,
	project_name VARCHAR(100) NOT NULL,
	project_desc text NOT NULL,
	created TIMESTAMP NOT NULL
);