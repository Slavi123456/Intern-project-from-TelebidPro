CREATE TABLE district (
    id CHAR(3) PRIMARY KEY,
    name VARCHAR(25) NOT NULL UNIQUE,
    name_en VARCHAR(25) NOT NULL UNIQUE,
    center_id CHAR(5) NOT NULL,
    CHECK (length(id) = 3),
    CHECK (length(center_id) = 5)
);

CREATE TABLE township (
    id CHAR(5) PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    name_en VARCHAR(25) NOT NULL,
    district_id CHAR(3) NOT NULL REFERENCES district(id),
    center_id CHAR(5) NOT NULL,
    CHECK (length(id) = 5),
    CHECK (length(district_id) = 3),
    CHECK (substr(id, 1, 3) = district_id),
    CHECK (length(center_id) = 5)
);

CREATE TABLE villages (
    id CHAR(5) PRIMARY KEY,
    name VARCHAR(70) NOT NULL UNIQUE,
    name_en VARCHAR(70) NOT NULL UNIQUE,
    township_id CHAR(5) NOT NULL REFERENCES township(id),
    district_id CHAR(3) NOT NULL REFERENCES district(id),
    CHECK (length(id) = 5),
    CHECK (length(township_id) = 5),
    CHECK (length(district_id) = 3),
    CHECK (substr(township_id, 1,3) = district_id)
);

CREATE TABLE cityhall (
    id CHAR(8) PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    name_en VARCHAR(25) NOT NULL,
    township_id CHAR(5) NOT NULL REFERENCES township(id),
    CHECK (length(id) = 8),
    CHECK (length(township_id) = 5),
    CHECK (substr(id, 1,5) = township_id)
);

CREATE INDEX idx_township_district_id  ON township(district_id);
CREATE INDEX idx_villages_township_id ON villages(township_id);
CREATE INDEX idx_villages_district_id ON villages(district_id);
CREATE INDEX idx_cityhall_township_id ON cityhall(township_id);



-- SELECT * FROM district;

-- DROP TABLE villages, township, district, cityhall;


-- INSERT INTO township(id, name,district_id, center_id) VALUES('VAR06', 'Varna', 'VAR', '10135') RETURNING *;
-- INSERT INTO township(id, name,district_id, center_id) VALUES('VAR07', 'Varna1', 'VAR', '10135') RETURNING *;

-- INSERT INTO cityhall(id, name, township_id) VALUES('VAR06-08', 'Kazashko', 'VAR06') RETURNING *;
-- INSERT INTO villages(id, name, township_id, district_id) VALUES('94042', 'Курортен комплекс "Международен младежки център - Приморско"', 'VAR06', 'VAR') RETURNING *;

-- TRUNCATE TABLE township, villages, cityhall, district;
-- TRUNCATE TABLE villages;

-- ALTER TABLE township DROP CONSTRAINT township_name_key;
-- ALTER TABLE cityhall DROP CONSTRAINT cityhall_name_key;
-- ALTER TABLE district DROP CONSTRAINT district_center_id_key;

-- SELECT id from district WHERE name = 'Варна';
-- SELECT id from township WHERE name = 'Варна';

-- EXPLAIN SELECT * FROM villages WHERE id = '94085';
-- EXPLAIN SELECT * FROM villages WHERE township_id = 'BGS27';
-- EXPLAIN SELECT * FROM cityhall WHERE id = 'MON36-10';
-- EXPLAIN SELECT * FROM cityhall WHERE name = 'Белимел';

