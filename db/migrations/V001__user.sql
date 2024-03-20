CREATE TABLE IF NOT EXISTS places(
	id serial PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	place_type TEXT NOT NULL,
	address	TEXT NOT NULL,
	latitude numeric,
	longitude numeric,
	price integer,
	score TEXT,
	link TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS work_time (
	place_id integer NOT NULL REFERENCES places (id),
	id serial PRIMARY KEY,
	day_of_week TEXT NOT NULL,
	open_time timestamptz,
	close_time timestamptz
);