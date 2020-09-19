CREATE TABLE jobs(
	id serial PRIMARY KEY,
	company_email text UNIQUE NOT NULL,
	title VARCHAR(100) NOT NULL,
	category_1 VARCHAR(100) NOT NULL,
	category_2 VARCHAR(100) NOT NULL,
	category_3 VARCHAR(100) NOT NULL,
	description text NOT NULL,
	qualification text NOT NULL,
	task text NOT NULL,
	requirement text NOT NULL,
	salary_type VARCHAR(100) NOT NULL,
	salary_price INT NOT NULL,
	joined TIMESTAMP NOT NULL
);