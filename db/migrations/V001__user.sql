CREATE TABLE IF NOT EXISTS places(
	id serial PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	place_type TEXT NOT NULL,
	address	TEXT NOT NULL,
	latitude numeric,
	longitude numeric,
	price TEXT,
	score TEXT,
	link TEXT NOT NULL,
	work_time JSONB
);

