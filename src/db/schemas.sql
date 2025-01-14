CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    state_province VARCHAR(255),
    alpha_two_code CHAR(2),
    web_pages TEXT, 
    UNIQUE (name, country)
);
