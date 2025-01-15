CREATE TABLE university_data(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    state_province VARCHAR(255),
    alpha_two_code CHAR(2),
    web_pages TEXT, 
    UNIQUE (name, country)
);

CREATE TABLE web_pages (
    id SERIAL PRIMARY KEY,
    university_id INT NOT NULL,
    web_page VARCHAR(255) NOT NULL,
    FOREIGN KEY (university_id) REFERENCES university_data(id) ON DELETE CASCADE
);

ALTER TABLE web_pages
ADD CONSTRAINT unique_university_webpage UNIQUE (university_id, web_page);