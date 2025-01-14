CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    alpha_two_code CHAR(2) NOT NULL,
    UNIQUE (name, country) 
);

CREATE TABLE webpages (
    id SERIAL PRIMARY KEY,
    university_id INT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    UNIQUE (university_id, url) 
);
